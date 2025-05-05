const express = require('express');
const app = express();
const { DateTime } = require("luxon");

const port = process.env.PORT || 3001
const registeredLights = new Map()

app.get('/', (req, res) => {
    res.send('404 Page not found');
});

app.post('/register', (req, res) => {
    if (req.query.name){
        const keyValue = {name: req.query.name, patternName:"DEFAULT", patternActive:true}
        registeredLights.set(req.query.name,keyValue)
    }
    res.sendStatus(200);
});

app.put('/requestpattern', (req, res) => {
    if (req.query.name){
        const values = registeredLights.get(req.query.name)
        if (values){
            values.patternName = req.query.patternName;
            values.patternActive = false;
            values.requestSentAt = DateTime.utc();
            registeredLights.set(req.query.name,values)
        }else{
            const keyValue = {name: req.query.name, patternName:"DEFAULT", patternActive:true}
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