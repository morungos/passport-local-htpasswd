/* global describe, it, expect */

var Strategy = require('../lib/strategy');


describe('Strategy', function() {
    
  var strategy = new Strategy({file: "file"});
    
  it('should be named local', function() {
    expect(strategy.name).to.equal('local-htpasswd');
  });
  
  it('should throw if constructed without a file option', function() {
    expect(function() {
      var s = new Strategy();
    }).to.throw(TypeError, 'LocalHtpasswdStrategy requires a file option');
  });
  
});