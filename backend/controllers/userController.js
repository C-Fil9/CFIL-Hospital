const User = require("../models/User");

// lấy danh sách users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// thêm user
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// cập nhật user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// xóa user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
const updateProfile = async (req, res) => {
  try {
    const { username, email, phone, gender, dob, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, phone, gender, dob, address },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};


module.exports = {
  getProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
};