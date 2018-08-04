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
var trackingCurrentRateView = document.getElementById('trackingCurrentRateView');
trackingCurrentRateView.style.display = 'none';

//Emit events
btnSubmit.addEventListener('click', () => {
  clientSocket.emit('btnTrack', {
    textBoxSymbol: textBoxSymbol.value,
    textBoxRate: textBoxRate.value
  });

  //Reset the page
  textBoxSymbol.value = "";
  textBoxRate.value = "";
  inputErrorDisplayView.innerHTML = "";
  inputErrorDisplayView.style.display = 'none';
  trackingSubmittedView.innerHTML = "";
  trackingSubmittedView.style.display = 'none';
});

//Add Socket Listeners
clientSocket.on('inputError', (data) => {
  data.errors.forEach(element => {
    inputErrorDisplayView.innerHTML += element.text + "<br />";
  });
  inputErrorDisplayView.style.display = 'block';

});

clientSocket.on('startTracking', (data) => {
  //Data : {symbol: symbol, desiredRate: desiredRate, rateAtTrackingStart: rateAtTrackingStart, timeAtTrackingStart: timeAtTrackingStart
  trackingSubmittedView.innerHTML = "Tracking request successfully submitted for " + data.symbol + " at " + new Date().toLocaleTimeString() + "." +
    " <br />" + " An alert will be sent once the bid rate reaches " + data.desiredRate + ".";
  trackingSubmittedView.style.display = 'block';
  trackingCurrentRateView.innerHTML = data.symbol + "'s current rate is: " + data.rateAtTrackingStart;
  trackingCurrentRateView.style.display = 'block';
  lastRate = data.rateAtTrackingStart;
});

var lastRate = null;
clientSocket.on('checkCurrentRate', (data) => {
  if (lastRate != data.currentRate) {
    lastRate = data.currentRate;
    trackingCurrentRateView.innerHTML = data.symbol + "'s current rate is: " + data.currentRate + ". <br /> " +
      "Last rate change was at: " + new Date().toLocaleTimeString();
  }
});

clientSocket.on('success', (data) => {
  //Remove the tracking rate display
  trackingCurrentRateView.style.display = 'none';
  //Remove the tracking display
  trackingSubmittedView.innerHTML = "";
  trackingSubmittedView.style.display = 'none';
  //Data : {data.textBoxSymbol, data.targetRate, data.time}
  alert("ALERT! " + data.textBoxSymbol + " reached the target rate of " + data.targetRate + " at " + data.time);
});