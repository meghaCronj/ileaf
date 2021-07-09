var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let participantSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  phone: { type: number },
});

module.exports = mongoose.model(
  "Participant",
  participantSchema,
  "participant"
);
