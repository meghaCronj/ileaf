const express = require("express");
const Participants = require("../models/participants.model");
const auth = require("../auth/auth");
const { response } = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const router = new express.Router();

// Create a participant
router.post("/user/create", async (req, res) => {
  const participants = new Participants(req.body);
  try {
    await participants.save();
    const token = await participants.generateAuthToken();
    res.status(201).send({ participants, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login for a participant
router.post("/user/login", async (req, res) => {
  try {
    const participants = await Participants.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await participants.generateAuthToken();
    res.status(200).send({ participants, token });
  } catch (e) {
    res.status(400).send();
  }
});

// Logout for a participant
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.participants.tokens = req.participants.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.participants.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

// get All participant details accesible only if a customer is logged in
router.get("/user/getAll", auth, async (req, res) => {
  try {
    const participants = await Participants.find({});
    res.status(200).send(participants);
  } catch (e) {
    res.status(500).send(e);
  }
});

// get individual participant details
router.get("/user/detail", auth, async (req, res) => {
  try {
    res.status(200).send(req.participants);
  } catch (e) {
    res.status(500).send(e);
  }
});

// update
router.patch("/user/detail", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "firstName",
    "email",
    "lastName",
    "meetingId",
    "phone",
  ];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdates) {
    res.status(400).send({ error: "Invalid updates" });
  }
  try {
    updates.forEach((update) => (req.participants[update] = req.body[update]));
    await req.participants.save();
    res.status(200).send(req.participants);
  } catch (e) {
    res.status(400).send();
  }
});

// delete

router.delete("/user/delete/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!id) throw new Error("Id required to update");
  Participants.findOneAndDelete({ _id: id }, function (err, docs) {
    if (err) {
      res.status(400).send({ code: 400, message: err });
    } else {
      res.status(200).send({ docs, message: "deleted successfully" });
    }
  });
});

// get by meeting id
router.get("/user/meeting/:id", auth, async (req, res) => {
  const id = req.params.id;
  if (!id) throw new Error("id is required");

  try {
    const user = await Participants.find({ meetingId: id });

    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;
