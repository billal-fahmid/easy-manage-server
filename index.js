const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware use

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.vxlatcb.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxlatcb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const tasksCollection = client.db('tasks-manager-db').collection('tasks-collection');


        app.get('/all-tasks', async (req, res) => {
            const result = await tasksCollection.find().toArray()
            res.send(result)
        })

        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            const result = await tasksCollection.insertOne(newTask)
            res.send(result)
        })

        app.delete('/tasks/:id', async(req, res) =>{
            const id= req.params.id 
            const query = {_id: new ObjectId(id)}
            const result = await tasksCollection.deleteOne(query);
            res.send(result)
        })

        app.put('/task/update/:id' , async(req , res) =>{
            const id= req.params.id 
            const filter= {_id: new ObjectId(id)}
            const newData = req.body;
            const updateData={
                $set:{
                    title:newData.title,
                    description:newData.description,
                    bayerName:newData.bayerName,
                    dateline:newData.dateline,
                    status:newData.status

                }
            }
            const result = await tasksCollection.updateOne(filter,updateData)
            res.send(result)
            
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('tasks manager is running')
})

app.listen(port, () => {
    console.log(`tasks manager running port no is ${port}`)
})