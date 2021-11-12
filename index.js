const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



//database uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4t4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//database connection
async function run() {
  try {
    await client.connect();
    console.log('Hey, SAYON MOTORS database connected successfully.');

    //database collection
    const database = client.db("sayon-motors");
    const productsCollection = database.collection("products");
    const reviewsCollection = database.collection("reviews");
    const bikesCollection = database.collection("selectedBikes");
    const usersCollection = database.collection("users");
    const preOrderCollection = database.collection("preOrders");

    //products get api
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    //review get api
    app.get('/reviews', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    //selected bike get api
    app.get('/selectedBikes', async (req, res) => {
      const cursor = bikesCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    //pre orders bike get api
    app.get('/preOrders', async (req, res) => {
      const cursor = preOrderCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    // //users get api
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    //product post api
    app.post('/products', async (req, res) => {
      const newProducts = req.body;
      const result = await productsCollection.insertOne(newProducts);
      res.json(result);
    });

    //review post api
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });

    //selected bike collection...
    app.post('/selectedBikes', async (req, res) => {
      const bike = req.body;
      const result = await bikesCollection.insertOne(bike);
      console.log(result);
      res.json(result);
    });

    //pre-order bike collection...
    app.post('/preOrders', async (req, res) => {
      const bike = req.body;
      const result = await preOrderCollection.insertOne(bike);
      console.log(result);
      res.json(result);
    });

     //get which users are admin
     app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })

    //users information post api in database
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    })


    //delete selected bike api
    app.delete('/selectedBikes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bikesCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    })

    //delete pre orders bike api
    app.delete('/preOrders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await preOrderCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    })

    //delete products api
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    })

    //order update selected bike api...
    app.put('/selectedBikes/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status
        },
      };
      const result = await bikesCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    //Pre order bike status update
    app.put('/preOrders/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status
        },
      };
      const result = await preOrderCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    
    //user admin
    app.put('/users/admin', async(req, res) => {
      const user = req.body;
      const filter = {email: user.email};
      const updateDoc = {$set: {role: 'admin'}};
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })


  } finally {

    //   await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('welcome to sayon motors')
})

app.listen(port, () => {
  console.log(` listening at prot:${port}`)
})