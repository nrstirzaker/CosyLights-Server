const express = require('express');
const app = express();

const port = process.env.PORT || 3000
const registeredLights = new Map()

app.get('/', (req, res) => {
    res.send('404 Page not found');
});

app.post('/register', (req, res) => {
    if (req.query.name){
        const keyValue = {registeredName: req.query.name,pattern:"DEFAULT",patternActive:true}
        registeredLights.set(req.query.name,keyValue)
    }
    res.sendStatus(200);
});

app.put('/requestpattern', (req, res) => {
    if (req.query.name){
        const values = registeredLights.get(req.query.name)
        if (values){
            values.pattern = req.query.pattern;
            values.patternActive = false;
            registeredLights.set(req.query.name,values)
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
            res.json(values);
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