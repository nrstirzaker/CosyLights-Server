const express = require('express');
const app = express();
const { DateTime } = require("luxon");
const cors = require('cors')

const port = process.env.PORT || 3001
const registeredLights = new Map()
const defaultPatternName = "Default"
const allPatterns = [];
app.use(cors());


app.get('/', (req, res) => {
    res.send('404 Page not found');
});

app.post('/register', (req, res) => {
    if (req.query.name){
        const keyValue = {name: req.query.name, patternName:defaultPatternName, patternActive:true,lastUpdated:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)}
        registeredLights.set(req.query.name,keyValue)
    }
    res.sendStatus(200);
});

app.get('/registered', (req, res) => {
    const details = []
    registeredLights.keys().forEach(key => {
        details.push(registeredLights.get(key));
    })
    const values = {lights: details}
    res.status(200).json(values);
});


app.get('/allpatterns', (req, res) => {
    res.status(200).json(allPatterns);
});

app.put('/requestpattern', (req, res) => {
    if (req.query.name){
        const values = registeredLights.get(req.query.name)
        if (values){
            values.patternName = req.query.patternName;
            values.patternActive = false;
            values.requestSentAt = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
            registeredLights.set(req.query.name,values)
            allPatterns.push(values.patternName)
        }else{
            const keyValue = {name: req.query.name, patternName:defaultPatternName, patternActive:true, requestSentAt:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)};
            registeredLights.set(req.query.name,keyValue)
        }
    }
    res.sendStatus(200);
});

app.put('/retrievepattern', (req, res) => {
    if (req.query.name){
        const values = registeredLights.get(req.query.name)
        if (values){
            values.patternActive = true;
            values.lastUpdated = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
            registeredLights.set(req.query.name,values)
            res.status(200).json(values);
        }else{
            res.sendStatus(500);
        }
    }else{
        res.sendStatus(500);
    }

});

app.listen(port, () => {
    console.log('listening on *:'+ port);
});