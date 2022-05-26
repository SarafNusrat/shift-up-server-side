const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdso6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const partsCollection = client.db('shiftUp').collection('parts');

        // get all parts for homepage 
        app.get('/parts', async(req,res) => {
            const query = {};
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
          });

        // // delete a part
        // app.delete('/parts/:id', async(req,res) => {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const result = await partsCollection.deleteOne(query);
        //     res.send(result);
        // })

    }
    finally{
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Shift Up Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})


