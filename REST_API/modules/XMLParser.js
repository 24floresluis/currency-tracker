/*
XMLParser will download the rates off of "https://rates.fxcm.com/RatesXML" and parse the results.
Data will be in the following format:
{"Rate":[
    {"Symbol":"EURUSD",
      "Bid":"1.16934",
      "Ask":"1.16935",
      "High":"1.16954",
      "Low":"1.16854",
      "Direction":"1",
      "Last":"20:52:08"},
    {"Symbol":"USDJPY",
      "Bid":"111.247",
      "Ask":"111.248",
      "High":"111.516",
      "Low":"111.245",
      "Direction":"1",
      "Last":"20:52:09"},
      ...etc
*/

//Imports
const download = require('download');
const xml2js = require('xml2js');

//Exports
module.exports.getData = getData;

//Module variables
const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true, explicitRoot: false });
const downloadUrl = 'https://rates.fxcm.com/RatesXML';

//Functions
//getData downloads the data. On a download failure, will repeatedly try downloading until successful.
//On a failed parse, the website must be corrupt, so it will log the error and stop.
function getDataWithRetry(callback) {
  download(downloadUrl)
    .then((xmlData) => {
      parseData(xmlData, callback);
    })
    .catch(() => {
      retryDownload(callback);
    });
}

//This function gives up if it is unsuccessful in downloading the data.
//Needed for interval parsing
function getData(callback) {
  download(downloadUrl)
    .then((xmlData) => {
      parseData(xmlData, callback);
    });
}

function retryDownload(callback) {
  console.log('Error downloading xml data.');
  setTimeout(() => {
    getData(callback);
  }, 300);
}

function parseData(xmlData, callback) {
  parser.parseString(xmlData, (error, parsedData) => {
    if (error) {
      console.log(error);
    }
    else {
      callback(parsedData);
    }
  });
}