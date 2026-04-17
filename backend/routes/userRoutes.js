const router = require("express").Router();
const { verifyToken } = require("../middlewares/authMiddleware");

const {
  getProfile,
  updateProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.get("/me", verifyToken, getProfile);
router.put("/me", verifyToken, updateProfile);
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;