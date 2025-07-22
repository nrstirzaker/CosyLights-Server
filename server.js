const express = require('express');
const app = express();
const { DateTime } = require("luxon");
const winston = require('winston');

//pickup runtime param to put in demo mode
//this should load data from a stored local file

const cors = require('cors')

const port = process.env.PORT || 3001
const args = process.argv[2];

const defaultPatternName = "Default"
const allPatterns = [];


const registeredLights = new Map()
if (args === "demo"){
    const bottleDemoValues = {name: 'Bottle',  activePatternName: 'Flame',  newPatternRequestSentAt: '18/07/2025, 14:42'}
    registeredLights.set("Bottle",bottleDemoValues)
    const wall1DemoValues = {name: 'Wall1',  activePatternName: 'Ukraine',  newPatternRequestSentAt: '18/07/2025, 14:42'}
    registeredLights.set("Wall1",wall1DemoValues)
    allPatterns.push("Flame")
    allPatterns.push("Ukraine")
}

app.use(cors());

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});


logger.info("args: " +args)

app.get('/', (req, res) => {
    res.send('404 Page not found');
});

app.post('/register', (req, res) => {
    logger.info("/register?"+req.query.name);
    if (req.query.name){
        const keyValue = {name: req.query.name, activePatternName:defaultPatternName, lastUpdated:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)}
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
    logger.info("/registered:"+JSON.stringify(values));
    res.status(200).json(values);
});


app.get('/allPatterns', (req, res) => {
    logger.info("/allPatterns:"+JSON.stringify(allPatterns));
    res.status(200).json(allPatterns);
});

app.put('/requestPattern', (req, res) => {
    logger.info("/requestPattern...");
    if (req.query.name){
        const values = registeredLights.get(req.query.name)
        if (values){
            logger.info("/requestPattern:name " + req.query.name + "already registered:" );
            logger.info("/requestPattern:requestedPatternName: " + req.query.requestedPatternName );
            values.requestedPatternName = req.query.requestedPatternName;
            values.requestSentAt = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
            registeredLights.set(req.query.name,values)
            allPatterns.push(values.patternName)
        }else{
            logger.info("/requestPattern: new name " + req.query.name );
            logger.info("/requestPattern:patternName: " + req.query.patternName );
            const keyValue = {name: req.query.name, patternName:req.query.patternName, patternActive:true, newPatternRequestSentAt:DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)};
            registeredLights.set(req.query.name,keyValue)
        }
    }
    res.sendStatus(200);
});

app.put('/retrievePattern', (req, res) => {
    logger.info("/retrievePattern:" + req.query.name );
    if (req.query.name){
        const values = registeredLights.get(req.query.name)
        if (values){
            values.patternActive = true;
            values.lastUpdated = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
            registeredLights.set(req.query.name,values)
            res.status(200).json(values);
        }else{
            logger.info("/retrievePattern: name: " + req.query.name +":no pattern set!");
            res.sendStatus(500);
        }
    }else{
        logger.info("/retrievePattern: no name specified");
        res.sendStatus(500);
    }

});

app.listen(port, () => {
    console.log('listening on *:'+ port);
});