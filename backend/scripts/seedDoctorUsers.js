/**
 * Chạy từ thư mục backend:
 *   node scripts/seedDoctorUsers.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

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
  console.log("✅ Kết nối MongoDB thành công!\n");

  for (const doc of doctorAccounts) {
    try {
      // Kiểm tra tài khoản đã tồn tại chưa
      let user = await User.findOne({ email: doc.email });

      if (!user) {
        user = await User.create({
          username: doc.name,
          email: doc.email,
          password: doc.password,  // plain text (giống hệ thống hiện tại)
          role: "doctor",
        });
        console.log(`✅ Tạo user: ${doc.email}`);
      } else {
        // Đảm bảo role = doctor
        if (user.role !== "doctor") {
          user.role = "doctor";
          await user.save();
          console.log(`🔄 Cập nhật role → doctor: ${doc.email}`);
        } else {
          console.log(`⚠️  Đã tồn tại: ${doc.email}`);
        }
      }

      // Liên kết Doctor ↔ User
      const doctor = await Doctor.findByIdAndUpdate(
        doc.doctorId,
        { userId: user._id },
        { new: true }
      );

      if (doctor) {
        console.log(`   🔗 Doctor "${doctor.name}" → userId: ${user._id}\n`);
      } else {
        console.log(`   ❌ Không tìm thấy doctor: ${doc.doctorId}\n`);
      }

    } catch (err) {
      console.error(`❌ Lỗi [${doc.email}]:`, err.message);
    }
  }

  console.log("=".repeat(55));
  console.log("🎉 Hoàn thành! Tài khoản đăng nhập bác sĩ:");
  console.log("=".repeat(55));
  doctorAccounts.forEach((d) => {
    console.log(`  📧 ${d.email.padEnd(25)} 🔑 ${d.password}`);
  });
  console.log("=".repeat(55));

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Fatal:", err.message);
  process.exit(1);
});
