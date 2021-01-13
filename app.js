const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
var wl = 0;
//-----------------------------------------------------------------------------------------------------------------
//mongodb URI
const url = `mongodb+srv://kabanitech:makerspace@cluster0.f6tma.mongodb.net/<esp-data>?retryWrites=true&w=majority`
const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}

//Connect to MongoDB atlas
mongoose.connect(url, connectionParams)
    .then(() => {
        console.log('Connected to database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

// Write data to DB


// Read Data from DB


//-----------------------------------------------------------------------------------------------------------------

app.post('/', (req, res) => {
    const body = req.body;
    console.log(body);
    res.status(201).json({});
});

app.get('/', (req, res) => {
    console.log("get")
    res.send("hii");
})

app.get('/python', (req, res) => {
    console.log('req received from python client');
    res.send({WaterLevel: wl});
})

app.listen(process.env.PORT || 3000, () => {
    console.log(" Server is running at port 3000 \r\n ☼ http://localhost:3000");
});