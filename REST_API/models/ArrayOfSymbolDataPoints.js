const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
{"Symbol":"EURUSD",
      "Bid":"1.16934",
      "Ask":"1.16935",
      "High":"1.16954",
      "Low":"1.16854",
      "Direction":"1",
      "Last":"20:52:08"},
*/
      //Create Schema
const SymbolDataPoint = new Schema({
  Symbol:{
    type: String,
    required: true
  },
  Bid:{
    type: String,
    required: true
  },
  Ask:{
    type: String,
    required: true
  },
  High:{
    type: String,
    required: true
  },
  Low:{
    type: String,
    required: true
  },
  Direction:{
    type: String,
    required: true
  },
  Last:{
    type:String,
    required:true
  }
});

const ArrayOfSymbolDataPoints = new Schema({
  SymbolDataPoints: [SymbolDataPoint]
});

mongoose.model('ArraysOfSymbolDataPoints', ArrayOfSymbolDataPoints)