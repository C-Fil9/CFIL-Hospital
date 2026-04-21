/**
 * Script tạo tài khoản (User) cho các bác sĩ đã có trong DB
 * và liên kết với Doctor document qua userId
 * 
 * Chạy: node backend/scripts/seedDoctorUsers.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/.env" });

const connectDB = require("./backend/config/db");
const User = require("./backend/models/User");
const Doctor = require("./backend/models/Doctor");

const doctorAccounts = [
  {
    doctorId: "69ba963f6b7d88fbac2ba04a",
    name: "Nguyễn Thị Trang",
    email: "bs.trang@cfil.vn",
    password: "doctor123",
  },
  {
    doctorId: "69ba963f6b7d88fbac2ba04b",
    name: "Lý Văn Sơn",
    email: "bs.son@cfil.vn",
    password: "doctor123",
  },
  {
    doctorId: "69ba963f6b7d88fbac2ba04d",
    name: "Phùng Văn Long",
    email: "bs.long@cfil.vn",
    password: "doctor123",
  },
  {
    doctorId: "69ba963f6b7d88fbac2ba04f",
    name: "Cao Văn Hậu",
    email: "bs.hau@cfil.vn",
    password: "doctor123",
  },
  {
    doctorId: "69ba963f6b7d88fbac2ba052",
    name: "Lê Thị Kim",
    email: "bs.kim@cfil.vn",
    password: "doctor123",
  },
];

async function seed() {
  await connectDB();
  console.log("✅ Connected to MongoDB\n");

  for (const doc of doctorAccounts) {
    try {
      // Kiểm tra user đã tồn tại chưa
      let user = await User.findOne({ email: doc.email });

      if (!user) {
        user = await User.create({
          username: doc.name,
          email: doc.email,
          password: doc.password,
          role: "doctor",
        });
        console.log(`✅ Tạo tài khoản: ${doc.email} (password: ${doc.password})`);
      } else {
        console.log(`⚠️  Tài khoản đã tồn tại: ${doc.email}`);
      }

      // Liên kết Doctor ↔ User
      const result = await Doctor.findByIdAndUpdate(
        doc.doctorId,
        { userId: user._id },
        { new: true }
      );

      if (result) {
        console.log(`   🔗 Linked Doctor "${result.name}" → User ${user._id}\n`);
      } else {
        console.log(`   ❌ Không tìm thấy Doctor với id: ${doc.doctorId}\n`);
      }
    } catch (err) {
      console.error(`❌ Lỗi với ${doc.email}:`, err.message);
    }
  }

  console.log("=".repeat(50));
  console.log("🎉 Hoàn thành! Danh sách tài khoản bác sĩ:");
  doctorAccounts.forEach((d) => {
    console.log(`   📧 ${d.email}  |  🔑 ${d.password}`);
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
