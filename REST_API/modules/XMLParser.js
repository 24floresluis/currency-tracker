/*
XMLParser will download the rates off of "https://rates.fxcm.com/RatesXML" and parse the results, 
and store the data in json format inside "./data/newData.json".

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
    {"Symbol":"GBPUSD",
      "Bid":"1.31008",
      "Ask":"1.31012",
      "High":"1.31064",
      "Low":"1.3095",
      "Direction":"-1",
      "Last":"20:52:09"},
      ...etc
*/

const download = require('download');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({explicitArray: false, mergeAttrs: true, explicitRoot: false});
const downloadUrl = 'https://rates.fxcm.com/RatesXML';
module.exports.getData = getData;

function getData(callback){
  download(downloadUrl).then(data =>{
    parser.parseString(data, function(error, result){
      if(error){
        console.log('parseString error : ', error);
      }
      else{
        callback(result);
      }
    });
  });
}