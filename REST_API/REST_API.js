//Imports
const XMLParser = require('./modules/XMLParser');

//Exports
module.exports.retrieveCurrentSymbolRate = retrieveCurrentSymbolRate;
module.exports.getSymbolPosition = getSymbolPosition;

//Module variables

//Functions
//Given a valid symbol, retrieve the symbol's current rate.
//If it is not found, then the callback function will pass back a null value.
function retrieveCurrentSymbolRate(symbolToLookFor, callback) {
  XMLParser.getData(function (result) {
    var symbolsRate = null;
    result.Rate.forEach((value, index, array) => {
      if (value.Symbol.toUpperCase() == symbolToLookFor.toUpperCase()) {
        symbolsRate = value.Bid;
      }
    });
    callback(symbolsRate);
  });
}

function isSymbolValid(symbolToLookFor, callback) {
  //Validate input
  if (typeof symbolToLookFor != 'string') {
    console.log('Error typeof symbolToLookFor != string');
  }

  XMLParser.getData((parsedData) => {
    if (parsedData == null) {
      console.log('Error data == null');
    }
    else {
      var found = false;
      parsedData.Rate.forEach((value) => {
        if (value.Symbol.toUpperCase() == symbolToLookFor.toUpperCase()) {
          found = true;
        }
      });
      callback(found);
    }
  });
}

//Will return null if valid symbol not found.
function getSymbolPosition(symbolToLookFor, callback) {
  XMLParser.getData(function (result) {
    var symbolIndex = null;
    result.Rate.forEach((value, index, array) => {
      if (value.Symbol.toUpperCase() == symbolToLookFor.toUpperCase()) {
        symbolIndex = index;
      }
    });
    callback(symbolIndex);
  });
}