const express = require('express');
const app = express();
const port = 8000;
const expressHandlebars = require('express-handlebars');
//const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const getSymbolPosition = require('./REST_API/REST_API').getSymbolPosition;
const retrieveCurrentSymbolRate = require('./REST_API/REST_API').retrieveCurrentSymbolRate;
const beginIntervalParsing = require('./modules/scheduler').beginIntervalParsing;

const https = require('https');
const fs = require('fs');

//Required Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Mongoose is not yet in use.
/*
//Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/CurrencyTracker', { useNewUrlParser: true })
  .then(() =>
    console.log('MongoDB connected'))
  .catch((err) =>
    console.log(err));

//Load Mongoose model for data
require('./REST_API/models/ArrayOfSymbolDataPoints');
const ArrayOfSymbolDataPoints = mongoose.model('ArraysOfSymbolDataPoints');
*/

//Setup Handlebars
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Create server
app.listen(port, () => {
  console.log('Server started on port: ' + port);
});

//--------------------------User Interaction Below-----------------------------------
const BLANK = "";
const HIDE = "hidden";
const SHOW = "";
const NOERRORS = null;
var intervalObjs = [];

//GET index page
app.get('/', (req, res) => {
  console.log("61");
  clearIntervalParsing();
  console.log("62");
  //renderIndexPage parameter descriptions:
  //(req, res, validatedSymbol, targetRate, currentRate, rateSuccessTime, startCardViewValue, successNotifyViewValue, trackSubmitTime, errors, textBoxSymbolDisplayValue, textBoxRateDisplayRate)
  renderIndexPage(req, res, BLANK, BLANK, BLANK, BLANK, HIDE, HIDE, BLANK, NOERRORS, BLANK, BLANK)
  console.log("63");
});

//First Page's Submit Button is clicked to start tracking. NEED TO ADD clearing any previous tracking.
app.post('/track', (req, res) => {
  console.log("8");
  clearIntervalParsing();
  console.log("9");
  checkUserInputForErrors(req, res, (validatedSymbol, targetRate, currentRate) => {
    console.log("10");
    //renderIndexPage parameter descriptions:
    //(req, res, validatedSymbol, targetRate, currentRate, rateSuccessTime, startCardViewValue, successNotifyViewValue, trackSubmitTime, errors, textBoxSymbolDisplayValue, textBoxRateDisplayRate)
    var trackSubmitTime = new Date().toLocaleTimeString();
    console.log("11");
    renderIndexPage(req, res, validatedSymbol, targetRate, currentRate, BLANK, SHOW, HIDE, trackSubmitTime, NOERRORS, BLANK, BLANK);
    console.log("12");
    startIndexPageIntervalParsing(validatedSymbol, targetRate, req, res);
    console.log("13");
  });
});

//new Date().toLocaleTimeString()

//This just renders the page with the given parameters.
function renderIndexPage(req, res, validatedSymbol, targetRate, currentRate, rateSuccessTime, startCardViewValue, successNotifyViewValue, trackSubmitTime, errors, textBoxSymbolDisplayValue, textBoxRateDisplayRate) {
  console.log("6");
  res.render('index', {
    errors: errors,
    textBoxSymbolDisplayValue: textBoxSymbolDisplayValue,
    textBoxRateDisplayRate: textBoxRateDisplayRate,
    displaySymbol: validatedSymbol,
    displayRate: currentRate,
    displayTargetRate: targetRate,
    displayTrackingRequestSubmitTime: trackSubmitTime,
    displayRateSuccessTime: rateSuccessTime,

    //Hide or don't hide the startCardView and the successNotifyView
    startCardView: startCardViewValue,
    successNotifyView: successNotifyViewValue
  });
  console.log("7");
}

function startIndexPageIntervalParsing(validatedSymbol, targetRate, req, res) {
  console.log("64");
  beginIntervalParsing(validatedSymbol, (currentRate) => {
    console.log("65");
    //For testing, assume that we want the current rate to increase up to the target rate.
    console.log(validatedSymbol + " is at " + currentRate);
    if (parseFloat(currentRate) >= parseFloat(targetRate)) {
      console.log("66");
      var rateSuccessTime = new Date().toLocaleTimeString();
      console.log(rateSuccessTime);
      //renderIndexPage parameter descriptions:
      //(req, res, validatedSymbol, targetRate, currentRate, rateSuccessTime, startCardViewValue, successNotifyViewValue, trackSubmitTime, errors, textBoxSymbolDisplayValue, textBoxRateDisplayRate)
      console.log("4"); 
      clearIntervalParsing();
      console.log("67");
      //renderIndexPage(req, res, validatedSymbol, targetRate, currentRate, rateSuccessTime, HIDE, SHOW, BLANK, NOERRORS, BLANK, BLANK);
      console.log("Target rate reached. Stopping interval parsing.");
 
      console.log("1");
    }
  },
    (intervalObj) => {
      console.log("2");
      intervalObjs.push(intervalObj);
      console.log("3");
    }
  );
}

function clearIntervalParsing() {
  console.log("68");
  intervalObjs.forEach((intervalObj) => {
    console.log("Clear an intervalObj");
    clearInterval(intervalObj);
  });
  console.log('Interval parsing cleared');
}

//Server side user input validation. Check to see if user's input is valid.
//If it is not, then redisplay the page with error message(s).
function checkUserInputForErrors(req, res, callback) {
  console.log("14");
  getSymbolPosition(req.body.textBoxSymbol, (position) => {
    console.log("15");
    let errors = [];
    //Check for valid currency symbol
    if (!req.body.textBoxSymbol) {
      console.log("70");
      errors.push({ text: 'Please enter the currency symbol.' });
      console.log("71");
    }
    else if (position == null) {
      console.log("72");
      errors.push({ text: 'The entered currency symbol does not match any known currency symbol.' });
    }
    else {   //Currency symbol was valid. Retrieve the current rate.
      console.log("16");
      retrieveCurrentSymbolRate(req.body.textBoxSymbol, function (fetchedRate) {
        console.log("17");
        //Check for valid target rate 
        if (!req.body.textBoxRate) {
          errors.push({ text: 'Please enter the target rate.' });
        }
        else if (isNaN(req.body.textBoxRate)) {
          errors.push({ text: 'Please enter a number for the target rate. Ex: "12.3" without the "".' });
        }
        else if (req.body.textBoxRate <= 0) {
          errors.push({ text: 'Please enter a target rate greater than zero.' });
        }
        else if (req.body.textBoxRate == fetchedRate) {
          errors.push({ text: 'This symbol is already at the target rate' });
        }
        console.log("18");
        //Respond
        if (errors.length > 0) {
          //If any errors are encountered, then we will redisplay the webpage.
          //Whatever the user has entered into the input fields will stay.
          //The default display in the View the Tracked Symbol and Current Rate box will stay.

          //renderIndexPage parameter descriptions:
          //(req, res, validatedSymbol, targetRate, currentRate, rateSuccessTime, startCardViewValue, successNotifyViewValue, trackSubmitTime, errors, textBoxSymbolDisplayValue, textBoxRateDisplayRate)
          console.log("19");
          renderIndexPage(req, res, BLANK, BLANK, BLANK, BLANK, HIDE, HIDE, BLANK, errors, req.body.textBoxSymbol, req.body.textBoxRate);
          console.log("20");
          //If we do not get any errors, then proceed with the callback function.
        } else {
          console.log("21");
          //callback(symbol, desiredRate, currentRate); 
          callback(req.body.textBoxSymbol, req.body.textBoxRate, fetchedRate);
          console.log("22");
        }
      });
    }
    if (errors.length > 0) {
      //If any errors are encountered, then we will redisplay the webpage.
      //Whatever the user has entered into the input fields will stay.
      //The default display in the View the Tracked Symbol and Current Rate box will stay.
      console.log("23");
      renderIndexPage(req, res, BLANK, BLANK, BLANK, BLANK, HIDE, HIDE, BLANK, errors, req.body.textBoxSymbol, req.body.textBoxRate);
      console.log("81");
    }
  });
}