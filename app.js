const express = require('express');
const app = express();
const https = require("https");
const bodyParser = require('body-parser');
const _ = require('lodash');


const {
    response
} = require('express');
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('public'));

var year=new Date().getFullYear()

app.get("/", (req, res) => {
    const url = "https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true";
    https.get(url, (response) => {
        response.on("data", (data) => {
            const covidData = JSON.parse(data);
            const active = covidData.activeCases;
            const recovered = covidData.recovered;
            const recoveredNew = covidData.recoveredNew;
            const deaths = covidData.deaths;
            const deathsNew = covidData.deathsNew;
            const tests = covidData.previousDayTests;
            const lastUpdated = covidData.lastUpdatedAtApify;
            var state = " "
            res.render("home", {
                activeCases: active,
                recovered: recovered,
                deaths: deaths,
                recoveredNew: recoveredNew,
                deathsNew: deathsNew,
                tests: tests,
                lastUpdated: lastUpdated,
                year:year
            });
        })
    })
})

app.get("/:x",(req,res)=>{
    res.render('error')
});


app.post("/", (req, res) => {
    const url = "https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true";
    var x;
    var state;
    var userInput = _.startCase(req.body.search);
    https.get(url, (response) => {
        response.on("data", (data) => {
            const covidData = JSON.parse(data);
            for (var i = 0; i < 35; i++) {
                if (covidData.regionData[i].region === userInput) {
                    state = covidData.regionData[i].region;
                    x = i;
                } 
            }
                if(state === userInput){
                const active = covidData.regionData[x].totalInfected;
                const recovered = covidData.regionData[x].recovered;
                const recoveredNew = covidData.regionData[x].newRecovered;
                const deaths = covidData.regionData[x].deceased;
                const deathsNew = covidData.regionData[x].newDeceased;
                const lastUpdated = covidData.lastUpdatedAtApify;
                const newInfected = covidData.regionData[x].newInfected;

                res.render("state", {
                    activeCases: active,
                    recovered: recovered,
                    deaths: deaths,
                    recoveredNew: recoveredNew,
                    deathsNew: deathsNew,
                    lastUpdated:lastUpdated,
                    state: state,
                    year:year,
                    newInfected:newInfected
                });

            }
            else{
                res.render('error')
            }

        })
    })

})


app.listen(process.env.PORT || 3000, () => {
    console.log("Server setup success");
})