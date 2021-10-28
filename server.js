const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 4356;
const app = express();
require("dotenv").config();

//Middleware Setup

app.use(cors());
app.use(express.json());

//MongoDb Connection and Setup API

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_TARGET_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  if (err === undefined) {
    console.log("[*] Database Connected Successfully.");
  } else {
    console.error("[*] Database Connection Failed.");
  }
});

// Server Status

app.get("/", (req, res) => {
  res.status(200).send("Server Running");
});

// Listing Port

app.listen(port, () => {
  console.log("[*] Listening to port ", port);
});
