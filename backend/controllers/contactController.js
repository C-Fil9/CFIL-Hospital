const Contact = require("../models/Contact");

// @desc    Submit a contact message
// @route   POST /api/contacts
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully. We will contact you soon.",
      data: newContact,
    });
  } catch (error) {
    console.error("Submit Contact Error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// @desc    Get all contact messages (for Admin/Doctors)
// @route   GET /api/contacts
// @access  Private
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// @desc    Update contact (Reply)
// @route   PUT /api/contacts/:id
// @access  Private (Admin/Doctor)
exports.updateContact = async (req, res) => {
  try {
    const { status, replyMessage } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (status) contact.status = status;
    if (replyMessage) {
      contact.replyMessage = replyMessage;
      contact.repliedAt = Date.now();
      contact.status = "replied";
    }

    const updatedContact = await contact.save();

    res.json({
      success: true,
      data: updatedContact,
    });
  } catch (error) {
    console.error("Update Contact Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get messages for the logged-in user
// @route   GET /api/contacts/my-messages
// @access  Private
exports.getMyMessages = async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Contact.find({ email: user.email }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("Get My Messages Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Không tìm thấy liên hệ" });
    }

    res.json({
      success: true,
      message: "Đã xóa liên hệ thành công",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
