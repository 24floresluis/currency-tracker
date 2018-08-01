//Imports
const REST_API = require('../REST_API/REST_API');

//Exports
module.exports.beginIntervalParsing = beginIntervalParsing;

//Module variables
const delayBetweenParses = 1000;

//Functions
function beginIntervalParsing(symbolToParse, repeatedFunction, callback) {
  console.log("24");
  const intervalObj =
    setInterval(() => {
      console.log("25");
      REST_API.retrieveCurrentSymbolRate(symbolToParse, (currentRate) => {
        console.log("26");
        repeatedFunction(currentRate);
        console.log("27");
      });
    }, delayBetweenParses);
  console.log('About to do a callback');
  callback(intervalObj);
  console.log("28");
}