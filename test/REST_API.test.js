const assert = require('chai').assert;
var expect = require('chai').expect;

const restapi = require('../REST_API/REST_API');
const getData = require('../REST_API/modules/XMLParser').getData;




describe('REST_API', () => {
    describe('#getSymbolPosition()', ()=> {
        it.skip('should return a number index', (done)=> {
            getData((parsedData)=> {
                //console.log(Object.values(parsedData.Rate.EURUSD).Bid); 

                
            })

            // restapi.getSymbolPosition(()=> {

            // })
        })

        it('Should find a valid currency pair symbol')
    })

    describe('#retrieveCurrentSymbolRate()', ()=> {
        it.skip('should return a currency pair symbol bid rate', (done)=> {
            done()
        })
        it('should return currency pair rate as a number type')
    })

})