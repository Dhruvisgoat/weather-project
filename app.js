const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

    const query = req.body.cityname;
    const apiKey ="bd3c146fc064bb6addb979756400c282";
    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=" + apiKey + "&units=metric";

    https.get(url, function (response) {

        let resultData = '';
        response.on('data', data => resultData += data);
        response.on('end', () => {
            const weatherData = JSON.parse(resultData);
            const temperature = weatherData.list[1].main.temp;
            const weatherDescription = weatherData.list[1].weather[0].description;
            const icon = weatherData.list[1].weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<p>The weather is currently " + weatherDescription + "<p>");
            res.write("<h1>The temperature in " + query + " is " + temperature + " degrees Celcius.</h1>");
            res.write("<img src=" + imageURL + ">");
            res.send();
        });
    });

});

app.listen(3000, function () {
    console.log("server is running on port 3000");
})