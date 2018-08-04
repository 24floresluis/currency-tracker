const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require('supertest');
rewire = require('rewire');
const app = require('../WebController');

//Socket.io testing tools
const io = require('socket.io-client');
const socketUrl = 'http://localhost:8000';

var options = {
    transports: ['websocket'],
    'force new connection' : true
}

describe('WebController', ()=> {

    describe('Sockets', ()=> {
        var client1;
    })
    it('should successfuly return a webpage: status 200');
    it('should route correctly');
    it('should return land in 404 if route does not exist');
})