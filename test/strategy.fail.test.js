/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , path = require('path')
  , Strategy = require('../lib/strategy');


describe('Strategy', function() {
    
  var filename = path.resolve(__dirname, '.htpasswd');

  describe('failing authentication with info', function() {
    var strategy = new Strategy({file: filename});
    
    var info;
    
    before(function(done) {
      chai.passport(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.username = 'testing';
          req.body.password = 'test';
        })
        .authenticate();
    });
    
    it('should fail', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('No such user');
    });
  });
  
  describe('failing authentication with info', function() {
    var strategy = new Strategy({file: filename});
    
    var info;
    
    before(function(done) {
      chai.passport(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.username = 'test';
          req.body.password = 'testing';
        })
        .authenticate();
    });
    
    it('should fail', function() {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Incorrect password');
    });
  });
  
});