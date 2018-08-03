//Imports
const REST_API = require('../REST_API/REST_API');

//Exports
module.exports.beginIntervalParsing = beginIntervalParsing;

//Module variables
const delayBetweenParses = 1000;

//Functions
function beginIntervalParsing(symbolToParse, repeatedFunction, callback) {
  const intervalObj =
    setInterval(() => {
      REST_API.retrieveCurrentSymbolRate(symbolToParse, (currentRate) => {
        repeatedFunction(currentRate);
      });
    }, delayBetweenParses);
  callback(intervalObj);
}