const express = require("express");
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

router.use(verifyJWT);

router.route('/').post(createNote).get(getNotes);
router.route('/:id').get(getNoteById).patch(updateNote).delete(deleteNote);

module.exports = router;