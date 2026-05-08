const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Appointment = require("../models/Appointment");

/* ===============================
   CREATE PAYMENT
================================ */
exports.createPayment = async (req, res) => {
  try {
    const { appointmentId, userId, amount, method } = req.body;

    if (!appointmentId || !userId || !amount) {
      return res.status(400).json({ message: "Missing data" });
    }

    const content = `PAY_${appointmentId}`;

    // 👉 Check for an existing pending payment to prevent duplicates
    let payment = await Payment.findOne({ appointmentId, status: "pending" });

    if (!payment) {
      payment = await Payment.create({
        appointmentId,
        userId,
        amount,
        method: method || "qr",
        content,
        status: "pending",
      });
    }

    // 👉 Generate QR URL with proper encoding
    const bankCode = (process.env.SEPAY_BANK || 'BIDV').split('N')[0]; // Simple normalization: BIDVNBANK -> BIDV
    const qrDescription = encodeURIComponent(payment.content);

    const qr = `https://qr.sepay.vn/img?acc=${process.env.BANK_ACCOUNT}&bank=${bankCode}&amount=${payment.amount}&des=${qrDescription}`;

    console.log("Generated QR URL:", qr);

    res.json({
      payment,
      qr,
    });

  } catch (err) {
    console.error("CREATE PAYMENT ERROR:", err);
    res.status(500).json({ message: "Create payment error" });
  }
};

/* ===============================
   WEBHOOK (SEPAY)
================================ */
exports.confirmPayment = async (req, res) => {
  try {
    console.log("--- SEPAY WEBHOOK RECEIVED ---");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));

    // 👉 Support multiple auth header formats: "Apikey XXX", "Bearer XXX", or raw token
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^(Apikey|Bearer)\s+/i, "").trim();

    console.log("🔑 Extracted token:", token);
    console.log("🔑 Expected token:", process.env.SEPAY_WEBHOOK_TOKEN);

    if (!token || token !== process.env.SEPAY_WEBHOOK_TOKEN) {
      console.error("❌ INVALID WEBHOOK TOKEN");
      return res.status(200).json({ success: false, message: "Invalid token" });
    }

    const {
      transferType, transferAmount, content,
      transactionContent,
      amountIn,
      accountNumber, subAccount,
      description
    } = req.body;

    // Normalize fields (SePay has multiple field names depending on version)
    const rawContent = transactionContent || content || description || "";
    const finalAmount = amountIn || transferAmount || 0;
    const finalAccount = subAccount || accountNumber || "";

    console.log("📝 Raw content:", rawContent);
    console.log("💰 Amount:", finalAmount);
    console.log("🏦 Account:", finalAccount);

    // Check for correct bank account
    const envAccount = String(process.env.BANK_ACCOUNT).trim();
    if (String(finalAccount).trim() !== envAccount && String(accountNumber || "").trim() !== envAccount) {
      console.warn(`⚠️ Account mismatch: Env=${envAccount}, Received=${finalAccount}/${accountNumber}`);
      return res.status(200).json({ success: true, message: "Account mismatch" });
    }

    // 👉 Remove ALL spaces and special chars from content before matching
    // Banks often strip underscores and add spaces, e.g. "PAY_69abc..." becomes "PAY 69abc..." or "PAY69abc..."
    const cleanContent = rawContent.replace(/\s+/g, "").toUpperCase();
    console.log("🧹 Cleaned content:", cleanContent);

    // Try to find PAY followed by a 24-char hex ObjectId
    let match = cleanContent.match(/PAY[_\s]?([A-F0-9]{24})/i);

    // Fallback: try on raw content too (in case cleaning broke something)
    if (!match) {
      match = rawContent.match(/PAY[_\s]?([a-fA-F0-9]{24})/i);
    }

    // Last resort: match any alphanumeric string after PAY
    if (!match) {
      match = cleanContent.match(/PAY[_\s]?([A-Z0-9]+)/i);
    }

    if (!match) {
      console.warn("⚠️ No PAY_ID or PAYID found in content:", rawContent);
      return res.status(200).json({ success: true });
    }

    const appointmentId = match[1].toLowerCase(); // ObjectIds are lowercase
    console.log("🔍 Found appointment ID in content:", appointmentId);

    // 👉 Search for payment: by appointmentId first, then by content field
    let payment = null;

    if (mongoose.Types.ObjectId.isValid(appointmentId)) {
      payment = await Payment.findOne({
        appointmentId: appointmentId,
        status: "pending"
      });
    }

    if (!payment) {
      payment = await Payment.findOne({
        content: { $regex: new RegExp(`PAY_?${appointmentId}`, "i") },
        status: "pending"
      });
    }

    if (!payment) {
      console.warn(`⚠️ No pending payment found for ID: ${appointmentId}`);
      // List all pending payments for debugging
      const allPending = await Payment.find({ status: "pending" }).select("content appointmentId amount");
      console.log("📋 All pending payments:", JSON.stringify(allPending, null, 2));
      return res.status(200).json({ success: true });
    }

    console.log(`✅ Found payment: ${payment._id}, content: ${payment.content}, amount: ${payment.amount}`);

    if (Number(finalAmount) < Number(payment.amount)) {
      console.warn(`⚠️ Partial payment: Expected ${payment.amount}, got ${finalAmount}`);
      return res.status(200).json({ success: true, message: "Insufficient amount" });
    }

    // 👉 Start MongoDB Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Update Payment Status
      payment.status = "paid";
      await payment.save({ session });

      // 2. Update Appointment Status
      const appointment = await Appointment.findByIdAndUpdate(
        payment.appointmentId,
        {
          paymentStatus: "paid",
          paymentMethod: "QR",
          transactionId: req.body.id // SePay transaction ID
        },
        { session, new: true }
      );

      if (!appointment) {
        throw new Error("Appointment not found during update");
      }

      await session.commitTransaction();
      session.endSession();

      console.log(`✅ PAYMENT SUCCESSFUL: Appointment ${appointmentId}`);
      res.status(200).json({ success: true });

    } catch (transactionError) {
      await session.abortTransaction();
      session.endSession();
      console.error("❌ TRANSACTION ERROR:", transactionError);
      throw transactionError;
    }

  } catch (err) {
    console.error("WEBHOOK GENERAL ERROR:", err);
    res.status(200).json({ success: false });
  }
};

/* ===============================
   CHECK PAYMENT (Frontend Polling)
================================ */
exports.checkPayment = async (req, res) => {
  try {
    const rawId = req.params.appointmentId;
    console.log(`🔍 Checking payment status for: ${rawId}`);

    // Case 1: Search by ObjectId (Standard)
    let payment = null;
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      payment = await Payment.findOne({ appointmentId: rawId });
    }

    // Case 2: Search by Content (If frontend accidental pass PAY_...)
    if (!payment) {
      // Extract numeric/hex ID if it has PAY prefix
      const match = rawId.match(/PAY_?([a-fA-F0-9]{24})/i) || rawId.match(/PAY_?([a-zA-Z0-9]+)/i);
      const extractedId = match ? match[1] : rawId;

      payment = await Payment.findOne({
        $or: [
          { appointmentId: mongoose.Types.ObjectId.isValid(extractedId) ? extractedId : null },
          { content: { $regex: new RegExp(`^PAY_?${extractedId}$`, "i") } }
        ]
      });
    }

    if (!payment) {
      return res.json({ paid: false, message: "No payment record found" });
    }

    console.log(`   > Status: ${payment.status}`);
    res.json({
      paid: payment.status === "paid",
      status: payment.status
    });

  } catch (err) {
    console.error("CHECK PAYMENT ERROR:", err);
    res.status(200).json({ paid: false, error: true }); // Return 200 to keep frontend polling alive if it's intermittent
  }
};

/* ===============================
   GET USER PAYMENTS
================================ */
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.params.userId,
    }).populate("appointmentId");

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user payments" });
  }
};

/* ===============================
   GET ALL PAYMENTS
================================ */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("appointmentId")
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all payments" });
  }
};

/* ===============================
   UPDATE PAYMENT STATUS (Admin)
================================ */
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'paid'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const payment = await Payment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("appointmentId").populate("userId", "username email");

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Sync appointment paymentStatus
    if (payment.appointmentId) {
      await Appointment.findByIdAndUpdate(
        payment.appointmentId._id,
        { paymentStatus: status === 'paid' ? 'paid' : 'unpaid' }
      );
    }

    res.json(payment);
  } catch (err) {
    console.error('UPDATE PAYMENT STATUS ERROR:', err);
    res.status(500).json({ message: 'Error updating payment status' });
  }
};

/* ===============================
   DELETE PAYMENT (Admin)
================================ */
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('DELETE PAYMENT ERROR:', err);
    res.status(500).json({ message: 'Error deleting payment' });
  }
};