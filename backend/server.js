const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// 🔥 Middleware
app.use(cors());
app.use(express.json());

// 🔥 Connect DB
connectDB();

// 🔥 Routes
app.use("/api/uploads", express.static("uploads"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/recruitments", require("./routes/recruitmentRoutes"));

// 🔥 Health check (rất nên có)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔥 Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    message: "Server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
