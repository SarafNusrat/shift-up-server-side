const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const ordersCollection = client.db('shiftUp').collection('orders');
        const reviewsCollection = client.db('shiftUp').collection('reviews');

        // get all parts for homepage 
        app.get('/parts', async(req,res) => {
            const query = {};
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
          });

        // get details of each part 
        app.get('/parts/:id',async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const part = await partsCollection.findOne(query);
            res.send(part);
        })

        // get all orders
        app.get('/orders', async(req,res) => {
            const query = {};
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
          });

        // add new order
        app.post('/orders', async(req, res) => {
            const newItem = req.body;
            const result = await ordersCollection.insertOne(newItem); 
            res.send(result);
        })

        // get all reviews
        app.get('/reviews', async(req,res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
          });

        // add new review
        app.post('/reviews', async(req, res) => {
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview); 
            res.send(result);
        })

        // // delete an order
        app.delete('/orders/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        })

        // Get My Orders
        app.get('/myOrders', async(req,res) => {
            const email = req.query.email;
            // if (email === decodedEmail) {
                const query = {email: email};
                const cursor = ordersCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            // }
            // else {
            //     res.status(403).send({message: 'forbidden access'})
            // }   
        })

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


