//package.json is a configuration file. Made using (1) npm init in the working directory in terminal
//express is a framework to make webserver. (2) terminal: npm install express
//nedb JavaScript database. nedb is a subset of MongoDB's API. (3) teminal: npm install nedb
//https://github.com/louischatriot/nedb

//require gives access to express node package
const express = require('express');
const Datastore = require('nedb');
//to use fetch function in node
const fetch = require('node-fetch');
//will tell server to load anything in a file called .env to an environment variable
require('dotenv').config();
//express comes in as a function which is executed and held in variable
const app = express();
//app.listen(3000, () => console.log('listening at 3000'));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`starting server at ${port}`);
});
//opens index.html in the directory
//can use filename or directory
app.use(express.static('public'));
//parse incoming data as json
app.use(express.json({limit: '1mb'}));

//database will be held in a local file specified
const database = new Datastore('database.db');
//load the data from the file into memory. If it isn't there it will create the file
database.loadDatabase();

//routing

app.get('/api',  (request, response) => {
    //https://github.com/louischatriot/nedb#finding-documents
    //find function set to find and send everything
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    })
    
});

//post is recieved to the address (/'')
//request holds all the data sent over. response is used to send things back to client
app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
    //response.json({
    //    status: 'success',
    //    timestamp: timestamp,
    //   latitude: data.lat,
    //    longitude: data.lon
    //});
});

app.get('/weather/:latlon',  async (request, response) => {
console.log(request.params);
const latlon = request.params.latlon.split(',');
console.log(latlon);
const lat = latlon[0];
const lon = latlon[1];
console.log(lat,lon);
//https://openweathermap.org/current#data
const api_key = process.env.API_KEY;
const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`
const weather_response = await fetch(weather_url);
const weather_data = await weather_response.json();
//air quality api from https://www.iqair.com/dashboard/api
//const aq_url = `http://api.airvisual.com/v2/nearest_city?key=e0cf0141-0e9c-4ca2-b6c9-56765f07f0b5`
const aq_url = `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=e0cf0141-0e9c-4ca2-b6c9-56765f07f0b5`
const aq_response = await fetch(aq_url);
const aq_data = await aq_response.json();

const data = {
    weather: weather_data,
    air_quality: aq_data
}
response.json(data);
});