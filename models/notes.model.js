var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notes = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  meetingId: { type: mongoose.Schema.ObjectId, ref: "Meeting" },
});

module.exports = mongoose.model("Notes", notes, "notes");
