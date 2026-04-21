/**
 * Seed thêm 10 bác sĩ còn lại
 * Chạy: node scripts/seedDoctorUsers2.js
 */

require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

const doctorAccounts = [
  { doctorId: "69b94ebcbaae1d0aceb57543", name: "Nguyễn Văn An",    email: "bs.an@cfil.vn",    password: "doctor123" },
  { doctorId: "69b94ebcbaae1d0aceb57544", name: "Trần Thị Bình",    email: "bs.binh@cfil.vn",  password: "doctor123" },
  { doctorId: "69b94ebcbaae1d0aceb57545", name: "Lê Văn Cường",     email: "bs.cuong@cfil.vn", password: "doctor123" },
  { doctorId: "69b94ebcbaae1d0aceb57546", name: "Phạm Thị Dung",    email: "bs.dung@cfil.vn",  password: "doctor123" },
  { doctorId: "69b94ebcbaae1d0aceb57547", name: "Hoàng Văn Đức",    email: "bs.duc@cfil.vn",   password: "doctor123" },
  { doctorId: "69b94ebcbaae1d0aceb57548", name: "Nguyễn Thị Hạnh",  email: "bs.hanh@cfil.vn",  password: "doctor123" },
  { doctorId: "69b94ebcbaae1d0aceb57549", name: "Đặng Văn Khoa",    email: "bs.khoa@cfil.vn",  password: "doctor123" },
  { doctorId: "69b94ebcbaae1d0aceb5754a", name: "Phan Thị Lan",     email: "bs.lan@cfil.vn",   password: "doctor123" },
  { doctorId: "69b94ebcbaae1d0aceb5754b", name: "Võ Văn Minh",      email: "bs.minh@cfil.vn",  password: "doctor123" },
  { doctorId: "69b94ebcbaae1d0aceb5754c", name: "Trương Thị Mai",   email: "bs.mai@cfil.vn",   password: "doctor123" },
];

async function seed() {
  await connectDB();
  console.log("✅ Kết nối MongoDB thành công!\n");

  for (const doc of doctorAccounts) {
    try {
      let user = await User.findOne({ email: doc.email });
      if (!user) {
        user = await User.create({
          username: doc.name,
          email: doc.email,
          password: doc.password,
          role: "doctor",
        });
        console.log(`✅ Tạo user: ${doc.email}`);
      } else {
        if (user.role !== "doctor") { user.role = "doctor"; await user.save(); }
        console.log(`⚠️  Đã tồn tại: ${doc.email}`);
      }

      const doctor = await Doctor.findByIdAndUpdate(doc.doctorId, { userId: user._id }, { new: true });
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
  console.log("🎉 Hoàn thành! Thêm 10 tài khoản bác sĩ:");
  console.log("=".repeat(55));
  doctorAccounts.forEach((d) => {
    console.log(`  📧 ${d.email.padEnd(25)} 🔑 ${d.password}`);
  });
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
