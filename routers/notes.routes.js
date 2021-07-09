const express = require("express");
const Notes = require("../models/notes.model");
const auth = require("../auth/auth");
const { response } = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const router = new express.Router();

// create meeting
router.post("/notes/create", async (req, res) => {
  const { meetingId } = req.body;
  if (!meetingId) throw error("require meeting id");
  const note = new Notes(req.body);
  try {
    await note.save();
    res.status(201).send({ note });
  } catch (e) {
    res.status(400).send(e);
  }
});

// get all note details
router.get("/notes/all", async (req, res) => {
  try {
    const notes = await Notes.find({});
    res.send(notes);
  } catch (e) {
    res.status(500).send(e);
  }
});

// get by meeting id
router.get("/notes", async (req, res) => {
  const id = req.query.id;
  if (!id) throw new Error("id is required");
  try {
    const notes = await Notes.find({ meetingId: id });
    res.send(notes);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;