const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = 1234;
const app = express();
require("dotenv").config();

//Middleware Setup

app.use(cors());
app.use(express.json());

// SERVER STATUS
app.get("/", (req, res) => {
  res.status(200).send("Server Running [OK]");
});

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
      const database = client.db("travel");
      const haiku = database.collection("services");
      const database2 = client.db("reviews");
      const haiku2 = database2.collection("rview");
      const database3 = client.db("Orders");
      const haiku3 = database3.collection("orderdata");

      //GET API FOR SERVICES
      app.get("/services", async (req, res) => {
        const cursor = haiku.find();
        const users = await cursor.toArray();
        res.send(users);
      });

      //GET API FOR REVIEWS
      app.get("/reviews", async (req, res) => {
        const cursor2 = haiku2.find({});
        const users2 = await cursor2.toArray();
        res.send(users2);
      });

      //GET API FOR ORDERINFO
      app.get("/placeorder", async (req, res) => {
        const cursor3 = haiku3.find({});
        const users3 = await cursor3.toArray();
        res.send(users3);
      });

      //GET SINGLE SERVICE
      app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        console.log("[*] Getting single service id", id);
        const query = { _id: ObjectId(id) };
        const service = await haiku.findOne(query);
        res.json(service);
      });

      //GET SINGLE ORDER INFO
      app.get("/placeorder/:id", async (req, res) => {
        const id = req.params.id;
        console.log("[*] Getting single service id", id);
        const query = { _id: ObjectId(id) };
        const orderInfo = await haiku3.findOne(query);
        res.json(orderInfo);
      });

      //POST API FOR ORDER INFO
      app.post("/placeorder", async (req, res) => {
        const orderInfo = req.body;
        const result = await haiku3.insertOne(orderInfo);
        res.json(result);
        console.log("[*] Service uploaded to database");
      });

      //POST API FOR SERVICES
      app.post("/services", async (req, res) => {
        const serviceInfo = req.body;
        const result = await haiku.insertOne(serviceInfo);
        res.json(result);
        console.log("[*] Service uploaded to database");
      });

      //DELETE API
      app.delete("/placeorder/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await haiku3.deleteOne(query);
        console.log("deleteing user with id", result);
        res.json(result);
      });
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);
});

// Listing Port

app.listen(port, () => {
  console.log("[*] Listening to port ", port);
});
