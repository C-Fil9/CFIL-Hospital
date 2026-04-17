const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Assuming you have an auth middleware somewhere in your project
// const { verifyToken, isAdmin } = require("../middlewares/auth");

/* ===============================
   CREATE PAYMENT
   (Should require a logged-in user)
================================ */
// router.post("/create", verifyToken, paymentController.createPayment);
router.post("/create", paymentController.createPayment);

/* ===============================
   SEPAY WEBHOOK 
   (Publicly accessible so SePay can reach it, but protected by API Key in controller)
================================ */
router.post("/webhook", paymentController.confirmPayment);

/* ===============================
   CHECK PAYMENT
   (Should ideally require a logged-in user)
================================ */
// router.get("/check/:appointmentId", verifyToken, paymentController.checkPayment);
router.get("/check/:appointmentId", paymentController.checkPayment);

/* ===============================
   GET USER PAYMENTS
   (Should require the user to be logged in)
================================ */
// router.get("/user/:userId", verifyToken, paymentController.getUserPayments);
router.get("/user/:userId", paymentController.getUserPayments);

/* ===============================
   GET ALL PAYMENTS
   (Should strictly require an ADMIN role)
================================ */
// router.get("/all", verifyToken, isAdmin, paymentController.getAllPayments);
router.get("/all", paymentController.getAllPayments);

/* ===============================
   UPDATE PAYMENT STATUS (Admin)
================================ */
router.put("/:id/status", paymentController.updatePaymentStatus);

/* ===============================
   DELETE PAYMENT (Admin)
================================ */
router.delete("/:id", paymentController.deletePayment);

module.exports = router;