const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Public route to submit contact form
router.post("/", contactController.submitContact);

// Admin/Doctor route to view messages
router.get("/", contactController.getAllContacts);

// Admin/Doctor route to reply/update message
router.put("/:id", contactController.updateContact);

// Private route for users to see their own messages
const { verifyToken } = require("../middlewares/authMiddleware");
router.get("/my-messages", verifyToken, contactController.getMyMessages);

// Admin route to delete a contact message
router.delete("/:id", contactController.deleteContact);

module.exports = router;
