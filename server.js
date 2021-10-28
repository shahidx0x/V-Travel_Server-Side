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

  async function run() {
    try {
      await client.connect();
      const database = client.db("carMechanic");
      const haiku = database.collection("services");
      //GET API
      app.get("/services", async (req, res) => {
        const cursor = haiku.find({});
        const users = await cursor.toArray();
        res.send(users);
      });

      //GET SINGLE SERVICE
      app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        console.log("[*] Getting single service id", id);
        const query = { _id: ObjectId(id) };
        const service = await haiku.findOne(query);
        res.json(service);
      });
      //POST API
      app.post("/services", async (req, res) => {
        console.log("[*] Service uploaded to database");
        const service = req.body;
        const result = await haiku.insertOne(service);
        res.json(result);
      });
      //DELETE API
      app.delete("/dbuser/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await haiku.deleteOne(query);
        console.log("deleteing user with id", result);
        res.json(result);
      });
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
});

// Server Status

app.get("/", (req, res) => {
  res.status(200).send("Server Running");
});

// Listing Port

app.listen(port, () => {
  console.log("[*] Listening to port ", port);
});
