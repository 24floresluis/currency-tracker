//Declaration of assertion and XMLParser requirements
var assert = require('chai').assert;
var expect = require('chai').expect;
const XMLParser = require('../REST_API/modules/XMLParser');

//Test Methods
//Exported Methods: getData() with function parameter
describe('XMLParser',() => {
    describe('#getData()',() => {
        it('getData() should construct an object with 61 symbols', function(done) {
            XMLParser.getData((parsedData)=> {
                assert.equal(parsedData.Rate.length, 61, "Not enough symbols");
                done();
            });
        });

        it('getData() object symbols should contain Bid of number type', function(done) {
            XMLParser.getData((parsedData)=> {
                //console.log(parsedData.Rate.; 
                parsedData.Rate.forEach(element => {
                    //console.log(typeof parseFloat(element.Bid));
                    assert.typeOf(parseFloat(element.Bid), 'number', "Bid is not number type");
                });
                done();   
            });

            
        });

        it('getData() object symbols should contain Ask of number type', function(done) {
            XMLParser.getData((parsedData)=> {
                //console.log(parsedData.Rate.; 
                parsedData.Rate.forEach(element => {
                    //console.log(typeof parseFloat(element.Bid));
                    assert.typeOf(parseFloat(element.Ask), 'number', "Ask is not number type");
                });
                done();   
            });            
        });

        it('getData() object symbols should contain High of number type', function(done) {
            XMLParser.getData((parsedData)=> {
                //console.log(parsedData.Rate.; 
                parsedData.Rate.forEach(element => {
                    //console.log(typeof parseFloat(element.Bid));
                    assert.typeOf(parseFloat(element.High), 'number', "High is not number type");
                });
                done();   
            });            
        });

        it('getData() object symbols should contain Low of number type', function(done) {
            XMLParser.getData((parsedData)=> {
                //console.log(parsedData.Rate.; 
                parsedData.Rate.forEach(element => {
                    //console.log(typeof parseFloat(element.Bid));
                    assert.typeOf(parseFloat(element.Low), 'number', "Low is not number type");
                });
                done();   
            });            
        });

        it('getData() object symbols should contain Direction value either 1,0,-1', function(done) {
            XMLParser.getData((parsedData)=> {
                //console.log(parsedData.Rate.; 
                parsedData.Rate.forEach(element => {
                    //console.log(typeof parseFloat(element.Bid));
                    expect(element.Direction).to.have.any.keys
                    ('-1','0','1');
                });
                done();   
            });            
        });

        // it('getData() object symbols should contain Last value in Date/Time fomat', function(done) {
        //     XMLParser.getData((parsedData)=> {
        //         //console.log(parsedData.Rate.; 
        //         parsedData.Rate.forEach(element => {
        //             //console.log(typeof parseFloat(element.Bid));
        //             console.log(element.Last);
                    
        //         });
        //         done();   
        //     });            
        // });





    });
});



