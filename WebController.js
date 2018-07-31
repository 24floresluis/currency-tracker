const express = require('express');
const app = express();
const port = 8000;
const expressHandlebars = require('express-handlebars');
//const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const getSymbolPosition = require('./REST_API/REST_API').getSymbolPosition;
const retrieveCurrentSymbolRate = require('./REST_API/REST_API').retrieveCurrentSymbolRate;

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
var blank = "N/A";

//GET index page
app.get('/', (request, response) => {
  response.render('index', {
    textBoxSymbolDisplayValue: "",
    textBoxRateDisplayRate: "",
    displaySymbol: blank,
    displayRate: blank,
    displayTargetRate: blank,
    displayTrackingRequestSubmitTime: blank
  });
});

//First Page's Submit Button is clicked
app.post('/track', (req, res) => {
  checkUserInputForErrors(req, res, function (validatedSymbol, targetRate, currentRate) {
    res.render('index', {
      textBoxSymbolDisplayValue: "",
      textBoxRateDisplayRate: "",
      displaySymbol: validatedSymbol,
      displayRate: currentRate,
      displayTargetRate: targetRate,
      displayTrackingRequestSubmitTime: new Date().toLocaleTimeString()       
    });
  });
});

//Server side user input validation. Check to see if user's input is valid.
//If it is not, then redisplay the page with error message(s).
function checkUserInputForErrors(req, res, callback) {
  getSymbolPosition(req.body.textBoxSymbol, (position) => {
    let errors = [];

    //Check for valid currency symbol
    if (!req.body.textBoxSymbol) {
      errors.push({ text: 'Please enter the currency symbol.' });
    }
    else if (position == null) {
      errors.push({ text: 'The entered currency symbol does not match any known currency symbol.' });
    }
    else {   //Currency symbol was valid. Retrieve the current rate.
      retrieveCurrentSymbolRate(req.body.textBoxSymbol, function (fetchedRate) {
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
        //Need to add validation to test whether or not the target rate has or has not already been met
        // as soon as the submit button is hit.
        //Set the direction >= or <= for rate checking

        //Respond
        if (errors.length > 0) {
          //If any errors are encountered, then we will redisplay the webpage.
          //Whatever the user has entered into the input fields will stay.
          //The default display in the View the Tracked Symbol and Current Rate box will stay.
          res.render('index', {
            errors: errors,
            textBoxSymbolDisplayValue: req.body.textBoxSymbol,
            textBoxRateDisplayRate: req.body.textBoxRate,
            displaySymbol: blank,
            displayRate: blank,
            displayTargetRate: blank,
            displayTrackingRequestSubmitTime: blank
          });

          //If we do not get any errors, then proceed with the callback function.
        } else {
          callback(req.body.textBoxSymbol, req.body.textBoxRate, fetchedRate);
        }
      });
    }
    if (errors.length > 0) {
      //If any errors are encountered, then we will redisplay the webpage.
      //Whatever the user has entered into the input fields will stay.
      //The default display in the View the Tracked Symbol and Current Rate box will stay.
      res.render('index', {
        errors: errors,
        textBoxSymbolDisplayValue: req.body.textBoxSymbol,
        textBoxRateDisplayRate: req.body.textBoxRate,
        displaySymbol: blank,
        displayRate: blank,
        displayTargetRate: blank,
        displayTrackingRequestSubmitTime: blank
      });
    }
  });
}