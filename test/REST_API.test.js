const assert = require('chai').assert;
const expect = require('chai').expect;

//Rewire is used to write mock dependencies for unwritten modules
const rewire = require('rewire');
const restapi = rewire('../REST_API/REST_API');
const xmlparser = rewire('../REST_API/modules/XMLParser');

const current = restapi.retrieveCurrentSymbolRate;
const symbolPosition = restapi.getSymbolPosition;


describe('REST_API', () => {
    describe('#getSymbolPosition()', ()=> {
        it('should return a number index', function(done){ 
            
            //Mock Dependency for XMLParser returns mock parsed data
            //from XML rates source
            restapi.__set__("XMLParser", XMLParser = {

                getData: function(callback) {
                    callback(
                        {
                        "Rate":[
                            {"Symbol":"TEST"}
                        ]
                        }
                    );
                }
                    
            })

            symbolPosition("TEST",(data) => {
                expect(data).to.be.a("number");
                //assert.equal(data, 0,);
                done();
            })
        })

        it('Should find a valid currency pair symbol', function(done){ 
            
            //Mock Dependency for XMLParser returns mock parsed data
            //from XML rates source
            restapi.__set__("XMLParser", XMLParser = {

                getData: function(callback) {
                    callback(
                        {
                        "Rate":[
                            {"Symbol":"TEST"}
                        ]
                        }
                    );
                }
                    
            })

            symbolPosition("TEST",(data) => {
                assert.equal(data, 0,);
                done();
            })
        })
    })

    describe('#retrieveCurrentSymbolRate()', ()=> {
        it('should return a currency pair symbol bid rate', function(done){ 
            
            //Mock Dependency for XMLParser returns mock parsed data
            //from XML rates source
            restapi.__set__("XMLParser", XMLParser = {

                getData: function(callback) {
                    callback(
                        {
                        "Rate":[
                            {
                                "Symbol":"TEST",
                                "Bid":"10"
                            }
                        ]
                        }
                    );
                }
                    
            })

            current("TEST",(data) => {
                expect(parseInt(data)).to.equal(10);
                done();
            })
        })
        it('should return currency pair rate as a number type', function(done){ 
            
            //Mock Dependency for XMLParser returns mock parsed data
            //from XML rates source
            restapi.__set__("XMLParser", XMLParser = {

                getData: function(callback) {
                    callback(
                        {
                        "Rate":[
                            {
                                "Symbol":"TEST",
                                "Bid":"10"
                            }
                        ]
                        }
                    );
                }
                    
            })

            current("TEST",(data) => {
                expect(parseInt(data)).to.be.a("number");
                done();
            })
        })
    })

})