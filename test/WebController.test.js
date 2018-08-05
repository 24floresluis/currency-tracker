const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');
const rewire = require('rewire');
const app = rewire('../WebController');

//Socket.io testing tools and properties
const io = require('socket.io-client');
const socketUrl = 'http://localhost:8000';

var options = {
    transports: ['websocket'],
    'force new connection' : true
}

//Will ommit comments on tests since the parameter describes the test.
describe('WebController', function () {

    describe('Web Page Functionality', () => {
        it('Loads the home page', function (done){
            request(app).get("/").expect(200).end(done);
        });
    
        it('Returns 404 if route does not exist', function(done) {
            request(app).get("/notaroute").expect(404).end(done);
        });
    });

    
    describe('Socket Functionality', function() {

        it('Socket successfully connects', function(done) {
            var client = io.connect(socketUrl, options);
            client.on('connect', done);    
         });

         it('Socket emits and gets a response if valid user input', (done) => {
            var client = io.connect(socketUrl,options);
            client.emit('btnTrack', {
                textBoxSymbol: 'EURUSD',
                textBoxRate: '15'
            });
            client.on('startTracking', (data) => {
                assert.equal(data.symbol, 'EURUSD');
                done();
            })
         });

         it('Socket emits and gets an error response if invalid symbol from user input', (done) => {
            var client = io.connect(socketUrl,options);
            client.emit('btnTrack', {
                textBoxSymbol: 'NOTASYMBOL',
                textBoxRate: '15'
            });
            client.on('inputError', (data) => {
                expect(data.errors[0].text).to.equal('The entered currency symbol does not match any known currency symbol.');
                done();
            });
         });

         it('Socket emits and gets an error response if invalid rate from user input', (done) => {
            var client = io.connect(socketUrl,options);
            client.emit('btnTrack', {
                textBoxSymbol: 'EURUSD',
                textBoxRate: 'NaN'
            });
            client.on('inputError', (data) => {
                expect(data.errors[0].text).to.equal('Please enter a number for the target rate. Ex: "12.3" without the "".');
                done();
            });
         });  
    });
    
})