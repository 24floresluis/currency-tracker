const port = 8000;
const express = require('express');
var socket = require('socket.io');
const app = express();
var path = require('path');
const bodyParser = require('body-parser');
const getSymbolPosition = require('./REST_API/REST_API').getSymbolPosition;
const retrieveCurrentSymbolRate = require('./REST_API/REST_API').retrieveCurrentSymbolRate;
const beginIntervalParsing = require('./modules/scheduler').beginIntervalParsing;

//Required Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Create server
var server = app.listen(port);

//Static files
app.use(express.static('public'));

//Socket setup
var io = socket(server);
io.on('connection', (socket) =>{
  //Set up listener for when the track button is clicked inside of a client browser
  socket.on('btnTrack', (data)=>{
    btnTrack(socket, data);
  });
});

//Keeps track of the inverals being parsed
var intervalObjs = [];

//GET index page
app.get('/', (req, res) => {
  clearIntervalParsing();
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

function btnTrack(socket, data){
  //Clear any previous tracking
  clearIntervalParsing(socket);
  checkUserInputForErrors(socket, data, (symbol, desiredRate, rateAtTrackingStart) => {
    var timeAtTrackingStart = new Date().toLocaleTimeString();
    startTracking(socket, symbol, desiredRate, rateAtTrackingStart, timeAtTrackingStart)
  });
}

function startTracking(socket, symbol, desiredRate, rateAtTrackingStart, timeAtTrackingStart) {
  //Tell the user that we are starting the tracking
  socket.emit('startTracking', {
    symbol: symbol,
    desiredRate: desiredRate,
    rateAtTrackingStart: rateAtTrackingStart,
    timeAtTrackingStart: timeAtTrackingStart
  });
  var rateDirection = null;
  if(parseFloat(desiredRate) > parseFloat(rateAtTrackingStart)){
    rateDirection = 'up';
  }
  else{
    rateDirection = 'down';
  }
  startIndexPageIntervalParsing(symbol, desiredRate, socket, rateDirection);
}

function startIndexPageIntervalParsing(validatedSymbol, targetRate, socket, rateDirection) {
  beginIntervalParsing(validatedSymbol, (currentRate) => {
    //Update the client with the most recent rate
    socket.emit('checkCurrentRate', {
      currentRate: currentRate,
      symbol: validatedSymbol
    });

    //If the target rate has been reached, then notify the client
    if (rateDirection == 'up' && (parseFloat(currentRate) >= parseFloat(targetRate))) {
      var rateSuccessTime = new Date().toLocaleTimeString();
      clearIntervalParsing();
      socket.emit('success', {
        textBoxSymbol: validatedSymbol,
        targetRate: targetRate,
        time: rateSuccessTime
      });
    }
    else if (rateDirection == 'down' && (parseFloat(currentRate) <= parseFloat(targetRate))) {
      var rateSuccessTime = new Date().toLocaleTimeString();
      clearIntervalParsing();
      socket.emit('success', {
        textBoxSymbol: validatedSymbol,
        targetRate: targetRate,
        time: rateSuccessTime
      });
    }
  },
    (intervalObj) => {
      intervalObjs.push(intervalObj);
    }
  );
}

function clearIntervalParsing() {
  intervalObjs.forEach((intervalObj) => {
    clearInterval(intervalObj);
  });
}

//Server side user input validation. Check to see if user's input is valid.
//If it is not, then redisplay the page with error message(s).
function checkUserInputForErrors(socket, data, callback) {
  getSymbolPosition(data.textBoxSymbol, (position) => {
    let errors = [];

    //Check for valid currency symbol
    if (data.textBoxSymbol == "") {
      errors.push({ text: 'Please enter the currency symbol.' });
    }
    else if (position == null) {
      errors.push({ text: 'The entered currency symbol does not match any known currency symbol.' });
    }
    else {   //Currency symbol was valid. Retrieve the current rate.
      retrieveCurrentSymbolRate(data.textBoxSymbol, (fetchedRate) => {
        //Check for valid target rate 
        if (data.textBoxRate == "") {
          errors.push({ text: 'Please enter the target rate.' });
        }
        else if (isNaN(data.textBoxRate)) {
          errors.push({ text: 'Please enter a number for the target rate. Ex: "12.3" without the "".' });
        }
        else if (parseFloat(data.textBoxRate) <= 0) {
          errors.push({ text: 'Please enter a target rate greater than zero.' });
        }
        else if (data.textBoxRate == fetchedRate) {
          errors.push({ text: 'This symbol is already at the target rate' });
        }

        //Respond
        if (errors.length > 0) {
          //If any errors are encountered, then we will redisplay the webpage.
          socket.emit('inputError', {errors});
        } else {  //If we do not get any errors, then proceed with the callback function.
          callback(data.textBoxSymbol, data.textBoxRate, fetchedRate);
        }
      });
    }
    if (errors.length > 0) {
      //If any errors are encountered, then we will redisplay the webpage.
      socket.emit('inputError', {errors});
    }
  });
}