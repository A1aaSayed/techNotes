const express = require("express");
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT')

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/userController");

router.use(verifyJWT);

router.route("/").post(createUser).get(getUsers);
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
