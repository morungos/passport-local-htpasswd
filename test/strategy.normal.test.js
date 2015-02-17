/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , path = require('path')
  , Strategy = require('../lib/strategy');


describe('Strategy', function() {

  var filename = path.resolve(__dirname, '.htpasswd');
    
  describe('handling a request with valid credentials in body', function() {
    var strategy = new Strategy({file: filename});
    
    var user
      , info;
    
    before(function(done) {
      chai.passport(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.username = 'test';
          req.body.password = 'test';
        })
        .authenticate();
    });
    
    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.username).to.equal('test');
    });
  });
  
  describe('handling a request with valid credentials in query', function() {
    var strategy = new Strategy({file: filename});
    
    var user
      , info;
    
    before(function(done) {
      chai.passport(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query.username = 'test';
          req.query.password = 'test';
        })
        .authenticate();
    });
    
    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.username).to.equal('test');
    });
  });
  
  describe('handling a request without a body', function() {
    var strategy = new Strategy({file: filename});
    
    var info, status;
    
    before(function(done) {
      chai.passport(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .authenticate();
    });
    
    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });
  
  describe('handling a request without a body, but no username and password', function() {
    var strategy = new Strategy({file: filename});
    
    var info, status;
    
    before(function(done) {
      chai.passport(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
          req.body = {};
        })
        .authenticate();
    });
    
    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });
  
  describe('handling a request without a body, but no password', function() {
    var strategy = new Strategy({file: filename});
    
    var info, status;
    
    before(function(done) {
      chai.passport(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.username = 'johndoe';
        })
        .authenticate();
    });
    
    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });
  
  describe('handling a request without a body, but no username', function() {
    var strategy = new Strategy({file: filename});
    
    var info, status;
    
    before(function(done) {
      chai.passport(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.password = 'secret';
        })
        .authenticate();
    });
    
    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing credentials');
      expect(status).to.equal(400);
    });
  });
  
});