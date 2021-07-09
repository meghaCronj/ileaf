var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var meetinSchema = new Schema({
  name: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  time: { type: String },
  date: { type: String },
});

module.exports = mongoose.model("Meeting", meetinSchema, "meeting");
