const assert = require('chai').assert;
const expect = require('chai').expect;
const rewire = require('rewire');
const scheduler = rewire('../modules/scheduler');
const sinon = require('sinon');

//Unit Test comment 
describe('Scheduler', () => {
    describe('#beginIntervalParsing()', ()=>{
        it('Scheduler repeats function every 1000ms', (done)=> {
            scheduler.__set__("REST_API", REST_API = {
                retrieveCurrentSymbolRate: (symbol = "TEST",callback) => {
                     callback(10);
                }
            })
            //Fake timer in order to "tick" or speedup timeout
            const clock = sinon.useFakeTimers();

            scheduler.beginIntervalParsing(
                "TEST",
                ()=>{
                    clock.tick(1000);
                },
                ()=>{});
            done();
        })
    })

})