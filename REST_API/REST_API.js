const XMLParser = require('./modules/XMLParser');

//Given a valid symbol, retrieve the symbol's current rate.
//If it is not found, then the callback function will pass back a null value.
module.exports.retrieveCurrentSymbolRate = function retrieveCurrentSymbolRate(symbolToLookFor, callback) {
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

//WILL DETERMINE 1. WHETHER THE INPUT SYMBOL IS FOUND 2. THE POSITION OF THE INPUT SYMBOL
//Returns the index x inside of data array Rate[x] that contains the passed in symbol.
//Will return null if it is not found within the Rate array.
module.exports.getSymbolPosition = function getSymbolPosition(symbolToLookFor, callback) {
  XMLParser.getData(function (result) {
    var symbolIndex = null;
    result.Rate.forEach((value, index, array) => {
      //console.log(JSON.stringify(value) + index);
      if (value.Symbol.toUpperCase() == symbolToLookFor.toUpperCase()) {
        //console.log("Symbol " + value.Symbol + " found at position: " + index);
        symbolIndex = index;
      }
    });
    callback(symbolIndex);
  });
}