//Make connection
var clientSocket = io.connect('http://localhost:8000');

//Query DOM
var inputErrorDisplayView = document.getElementById('inputErrorDisplayView');
inputErrorDisplayView.style.display = 'none';
var btnSubmit = document.getElementById('btnSubmit');
var trackingSubmittedView = document.getElementById('trackingSubmittedView');
trackingSubmittedView.style.display = 'none';
var textBoxSymbol = document.getElementById('textBoxSymbol');
var textBoxRate = document.getElementById('textBoxRate');

//Emit events
btnSubmit.addEventListener('click', () => {
  clientSocket.emit('btnTrack', {
    textBoxSymbol: textBoxSymbol.value,
    textBoxRate: textBoxRate.value
  });

  //Reset the page
  textBoxSymbol.value = "";
  textBoxRate.value = "";
  inputErrorDisplayView.innerHTML= "";
  inputErrorDisplayView.style.display = 'none';
  trackingSubmittedView.innerHTML= "";
  trackingSubmittedView.style.display = 'none';
});

//Add Socket Listeners
clientSocket.on('inputError', (data) =>{
  data.errors.forEach(element => {
    inputErrorDisplayView.innerHTML += element.text + "<br />";
  });  
  inputErrorDisplayView.style.display = 'block';
  
});

clientSocket.on('startTracking', (data)=>{ 
  //Data : {symbol: symbol, desiredRate: desiredRate, rateAtTrackingStart: rateAtTrackingStart, timeAtTrackingStart: timeAtTrackingStart
  trackingSubmittedView.innerHTML= "Tracking request successfully submitted for " + data.symbol + " at " + data.timeAtTrackingStart + "." +
  " <br />" + " An alert will be sent once the bid rate reaches " + data.desiredRate + ".";
  trackingSubmittedView.style.display = 'block';
});

clientSocket.on('success', (data)=>{ 
  //Remove the tracking display
  trackingSubmittedView.innerHTML= "";
  trackingSubmittedView.style.display = 'none';
  //Data : {data.textBoxSymbol, data.targetRate, data.time}
  alert("ALERT! " + data.textBoxSymbol + " reached the target rate of " + data.targetRate + " at " + data.time);
});