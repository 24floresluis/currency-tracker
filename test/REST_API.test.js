const assert = require('chai').assert;
var expect = require('chai').expect;

const restapi = require('../REST_API/REST_API');
const getData = require('../REST_API/modules/XMLParser').getData;




describe('REST_API', () => {
    describe('#getSymbolPosition', ()=> {
        it('getSymbolPosition test', (done)=> {
            getData((parsedData)=> {
                //console.log(Object.values(parsedData.Rate.EURUSD).Bid); 

                
            })

            // restapi.getSymbolPosition(()=> {

            // })
            done();
        })
    })

    describe('#retrieveCurrentSymbolRate', ()=> {
        it('retrieveCurrentSymbolRate test', (done)=> {
            done()
        })
    })

})