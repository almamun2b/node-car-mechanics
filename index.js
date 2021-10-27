const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u222i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("CarMechanics");
        const servicesCollection = database.collection("services");

        // GET API
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET Single Services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Getting Spesic Service by ID: ", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST API
        app.post('/services', async (req, res) => {
            // console.log("Hit the post api");
            // console.log("Request: ", req);
            // console.log("Responce: ", res);
            console.log("Request Body: ", req.body);

            const service = req.body;
            const result = await servicesCollection.insertOne(service);

            console.log("The Result: ", result);
            // console.log(`A document was inserted with the _id: ${result.insertedId}`);

            res.json(result);
        });

        // UPDATE API

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Server is Running");
});

app.listen(port, () => {
    console.log(`Server is Running at: http://localhost:${port}`);
});
