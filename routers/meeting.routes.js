const express = require("express");
const Meeting = require("../models/meeting.model");
const Notes = require("../models/notes.model");
const Participant = require("../models/participants.model");
const auth = require("../auth/auth");
const { response } = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const router = new express.Router();

// create meeting
router.post("/meeting/create", auth, async (req, res) => {
  console.log(req.body);
  const meeting = new Meeting(req.body);
  try {
    await meeting.save();
    res.status(201).send({ meeting });
  } catch (e) {
    res.status(400).send(e);
  }
});

// get all meeting details
router.get("/meeting/all", auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({});
    res.status(200).send(meetings);
  } catch (e) {
    res.status(500).send(e);
  }
});

// update meeting details
router.put("/meeting/update/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("Id required to update");

    let meeting = await Meeting.findById(id);
    let details = {
      name: req.body.name ? req.body.name : meeting.name,
      description: req.body.description
        ? req.body.description
        : meeting.description,
      date: req.body.date ? req.body.date : meeting.date,
      venue: req.body.venue ? req.body.venue : meeting.venue,
      time: req.body.time ? req.body.time : meeting.time,
    };
    Meeting.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: details,
      },
      { new: true },
      function (err, data) {
        if (err) {
          res.status(500).send({ code: 500, error: err });
        } else if (!data) {
          res.status(400).send({ code: 400, message: "Not Updated" });
        } else {
          res.status(200).send(data);
        }
      }
    );
  } catch (e) {
    res.status(500).send(e);
  }
});

// delete meeting
router.delete("/meeting/delete/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!id) throw new Error("Id required to update");
  Meeting.findOneAndDelete({ _id: id }, function (err, docs) {
    if (err) {
      res.status(200).send({ code: 400, message: err });
    } else {
      res.status(200).send.send({ docs, message: "deleted successfully" });
    }
  });
});

// get all meetings
router.get("/meeting/all", auth, async (req, res) => {
  try {
    const meetings = await Meeting.find({});
    res.status(200).send(meetings);
  } catch (e) {
    res.status(500).send(e);
  }
});

// get one meeting
router.get("/meeting/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) throw new Error("Id required");
    const notes = await Notes.find({ meetingId: id });
    const participants = await Participant.find({ meetingId: id });
    const meetings = await Meeting.find({ _id: id });
    res.status(200).send({
      data: {
        meetingDetail: { ...meetings },
        notes: notes,
        participants: participants,
      },
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
