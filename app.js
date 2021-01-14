const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');
const ejs = require("ejs");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var wl = 60;
var DBconn = new Boolean(false);
//-----------------------------------------------------------------------------------------------------------------
//mongodb
var dbo;
const url = `mongodb+srv://kabanitech:makerspace@cluster0.f6tma.mongodb.net/esp-data?retryWrites=true&w=majority`
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    DBconn = true;
    dbo = db.db("esp-data");
  });

function creatCollec(name){
    dbo.createCollection(name, function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
      });
}

//-----------------------------------------------------------------------------------------------------------------

function getTime(input) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let today = year + "-" + month + "-" + date;
    let dateTime = today + " " + hours + ":" + minutes + ":" + seconds;
    return input == "dt" ? dateTime : today;
}

app.post('/esp', (req, res) => {
    var newDoc = {
        deviceID: req.body.ID,
        dateTime: getTime("dt"),
        waterLevel: req.body.waterLevel
    };
    console.log(newDoc);
    dbo.collection(getTime("d")).insertOne(newDoc, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
      });
    res.status(201).json({});
});

app.get('/raw', (req, res) => {
    dbo.collection(getTime("d")).find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send({data : result});
      });
})

app.get('/table', (req, res) => {
    dbo.collection(getTime("d")).find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.render("pages/table", { data: result });
      });
})

app.get('/python', (req, res) => {
    console.log('req received from python client');
    console.log(wl);
    res.send({ WaterLevel: wl });
})

app.listen(process.env.PORT || 3000, () => {
    console.log(" Server is running at port 3000 \r\n ☼ http://localhost:3000");
});