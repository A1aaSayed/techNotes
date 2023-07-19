const Note = require("../models/noteModel");
const asyncHandler = require("express-async-handler");

// @desc    Create new note
// @route   POST    /notes
// @access  Private
exports.createNote = asyncHandler(async (req, res) => {
  const { title, content, user } = req.body;
  if (!title || !content || !user) {
    return res
      .status(404)
      .json({ message: "Title, Content and User are required" });
  }

  const duplicate = await Note.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate !== null) {
    return res.status(400).json({ message: "Duplicated note title" });
  }

  const note = { title, content, user };
  const newNote = await Note.create(note);
  if (newNote) {
    res.status(201).json({ newNote });
  } else {
    res.status(404).json({ message: "Failed to create note" });
  }
});

// @desc    Get all notes
// @route   GET    /notes
// @access  Public
exports.getNotes = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const notes = await Note.find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: "user", select: "username -_id" });
  if (notes.length == 0) {
    return res.status(400).json("No notes found");
  }
  res.status(200).json({ NotesNumber: notes.length, Notes: notes });
});

// @desc    Get a specific note by id
// @route   GET    /notes
// @access  Public
exports.getNoteById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (id == null) {
    return res.status(404).json(`No note with id ${id}`);
  }
  const note = await Note.findById(id).populate({ path: "user", select: "username -_id" });
  res.status(200).json(note);
});

// @desc    Update a specific note by id
// @route   PATCH    /notes
// @access  Private
exports.updateNote = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { title, content, user } = req.body;
  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json(`No note with id ${id}`);
  }
  const duplicate = await Note.findOne({ title });
  if (duplicate) {
    return res.status(404).json({ message: "Duplicated note title" });
  }

  note.title = title;
  note.content = content;
  note.user = user;

  const updatedNote = await note.save();
  res
    .status(200)
    .json(`Note with title '${updatedNote.title}' has been updated`);
});

// @desc    Delete a specific note by id
// @route   DEL    /notes
// @access  Private
exports.deleteNote = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const note = await Note.findByIdAndDelete(id);
  if (!note) {
    return res.status(404).json(`No note with id ${id}`);
  }
  res.status(200).json(`Note has been deleted`);
});
