const express = require("express");
const request = require('request');
const bodyParser = require("body-parser");
const authKey = require("./api_key/my_url");
const https = require("https");
const path = require("path");
const app = express();
const port = 9000


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
})

app.post('/', function(req, res){
    const query = req.body.cityName
    const apiKey = authKey.authKey;
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units="+ unit +""
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
          const weatherData = JSON.parse(data)
          const temp = weatherData.main.temp
          const weatherDescription = weatherData.weather[0].description
          const city = weatherData.name
          const icon = weatherData.weather[0].icon
          const imageURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png"

        
          res.write(`<p>The weather is currently ${weatherDescription}.</p>`);
          res.write("<h1>The temperture in "+query+" is "+temp+"&degC.<h1>");
          res.write("<img src = "+ imageURL +">");
          res.send()

        })
    })
})



app.listen(port, function(){
    console.log(`Server is listening on port ${port}`)
})
