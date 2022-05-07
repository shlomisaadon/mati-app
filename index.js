const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//connect to mongo
mongoose
  .connect("mongodb://localhost/whatsapp-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongo");
  })
  .catch((err) => {
    console.log("failed to connect to mongo server\r\n", err);
  });
///////////////////////////
//routes
const msgs = require("./routes/messages");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardsRouter = require("./routes/cards");
//use
app.use("/msgs", msgs);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/cards", cardsRouter);

// Listening for the server
const PORT = process.env.PORT || 3900;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
