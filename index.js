const express = require('express');
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8czld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run(){
    try {
      await client.connect();
      const database = client.db("geniusMechanic");
      const serviceCollection = database.collection("services");

      // POST API
      app.post("/services", async (req, res) => {
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
        console.log("Hit the post API", req.body);
        res.json(result);
      });

      // GET API
      app.get("/services", async (req, res) => {
        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      });

      // GET SINGLE API
      app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        console.log("Getting specific Id", id);
        const service = await serviceCollection.findOne(query);
        res.json(service);
      });

      // GET SINGLE API
      app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        console.log("Getting specific Id", id);
        const service = await serviceCollection.findOne(query);
        res.json(service);
      });

      // GET SINGLE API
      app.delete("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        console.log("Getting specific Id to Delete", id);
        const result = await serviceCollection.deleteOne(query);
        res.json(result);
        console.log(result);
      });

      // UPDATE API
      app.put("/services/:id", async (req, res) => {
        const id = req.params.id;
        const updateUser = req.body;
        console.log("Updating data by specific Id", id);
         const filter = { _id: ObjectId(id) };
         const options = { upsert: true };
         const updateDoc = {
           $set: {
             name: updateUser.name,
             description: updateUser.description,
             price: updateUser.price,
             img: updateUser.img,
           },
         };
         const result = await serviceCollection.updateOne(
           filter,
           updateDoc,
           options
         );
        res.json(result);
        console.log(result);
      });
    } finally{

    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running Genius car mechanic serve")
})

app.listen(port, ()=> {
    console.log(
      `Running Geinus car mechanic server on port http://localhost:${port}`
    );
})