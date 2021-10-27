const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = 5000;

// set middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krzs8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// dotenv install and console.log(uri)

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        
        // GET API
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET Single Service
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id)
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hitting server', service)
            const result = await servicesCollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result)
        });

        // DELETE API
        app.delete('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Runnign server ok')
})

app.listen(port, () => {
    console.log('server running at port ', port);
})