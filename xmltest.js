const XMLParser = require('./REST_API/modules/XMLParser');

let ha = XMLParser.getData(parsedData => {
    if(parsedData == null) {
        console.log('Error no data parsed');
    }
    else {
        console.log(parsedData);
    }

    // parsedData.Rate.forEach(element => {
    //     console.log(element.Symbol);
    //     console.log(element.Direction);
    // });
    // Size of array should be 61 (there is 61 symbols)
    // Bid: float
    // Ask: float
    // High: float
    // Low: float
    // Direction: Integer -1, 0, 1
    // Last: Time format
    //console.log(parsedData.Rate.length);
});