const express = require("express");
const app = express();
const port = 3000;
require("./db/database");

const participantsRouter = require("./routers/participants.route");
const meetingRouter = require("./routers/meeting.routes");
const notesRouter = require("./routers/notes.routes");
app.use(express.json());
app.use(participantsRouter);
app.use(meetingRouter);
app.use(notesRouter);

app.listen(port, () => {
  console.log(`server is up on ${port}`);
});
