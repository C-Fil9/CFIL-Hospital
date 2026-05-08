import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Doctor from "./pages/Doctors";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import DoctorRoute from "./components/DoctorRoute";
import DoctorLayout from "./components/DoctorLayout";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorMessages from "./pages/Doctor/DoctorMessages";
import DoctorMedicalRecords from "./pages/Doctor/DoctorMedicalRecords";
import PatientChat from "./pages/PatientChat";
import Appointments from "./pages/Appointments";
import Schedule from "./pages/Schedule";
import MedicalRecords from "./pages/MedicalRecords";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageDoctors from "./pages/Admin/ManageDoctors";
import ManageAppointments from "./pages/Admin/ManageAppointments";
import ManageContacts from "./pages/Admin/ManageContacts";
import ManageRecruitments from "./pages/Admin/ManageRecruitments";
import ManagePayments from "./pages/Admin/ManagePayments";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Services from "./pages/Services";
import Treatment from "./pages/Treatment";
import Guide from "./pages/Guide";
import Contact from "./pages/Contact";
import Recruitment from "./pages/Recruitment";
import ChatBox from "./components/ChatBox";
import Footer from "./components/Footer";
import Forbidden403 from "./pages/Forbidden403";
import "./App.css";

function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/medical-records" element={<MedicalRecords />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/treatment" element={<Treatment />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/403" element={<Forbidden403 />} />
        <Route path="/messages" element={<PatientChat />} />

        {/* Doctor routes */}
        <Route path="/doctor" element={<DoctorRoute><DoctorLayout /></DoctorRoute>}>
          <Route index element={<DoctorDashboard />} />
          <Route path="messages" element={<DoctorMessages />} />
          <Route path="medical-records" element={<DoctorMedicalRecords />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-doctors" element={<ManageDoctors />} />
          <Route path="manage-appointments" element={<ManageAppointments />} />
          <Route path="manage-contacts" element={<ManageContacts />} />
          <Route path="manage-recruitments" element={<ManageRecruitments />} />
          <Route path="manage-payments" element={<ManagePayments />} />
        </Route>
      </Routes>

      {/* ✅ Footer */}
      <Footer />

      {/* ✅ Chat AI */}
      <ChatBox />
    </>

  );
}

export default App;