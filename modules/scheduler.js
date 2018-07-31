//Imports
const REST_API = require('../REST_API/REST_API');

//Exports
module.exports.beginIntervalParsing = beginIntervalParsing;

//Functions
function beginIntervalParsing(timeDelay, symbolToParse, callback) {
  const intervalObj =
    setInterval(() => {
      REST_API.retrieveCurrentSymbolRate(symbolToParse, (currentRate) => {
        console.log(currentRate);
      });
    }, timeDelay);
  callback(intervalObj);
}

//Testing
beginIntervalParsing(1000, 'EURUSD', (intervalObj) => {
  setTimeout(() => {
    clearTimeout(intervalObj);
  }, 10000);
});