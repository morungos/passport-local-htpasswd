/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util')
  , fs = require('fs')
  , bcrypt = require('bcryptjs')
  , lookup = require('./utils').lookup;


/**
 * `Strategy` constructor.
 *
 * The local authentication strategy authenticates requests based on the
 * credentials submitted through an HTML-based login form.
 *
 * Applications must supply a `verify` callback which accepts `username` and
 * `password` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `usernameField`  field name where the username is found, defaults to _username_
 *   - `passwordField`  field name where the password is found, defaults to _password_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new LocalHtpasswdStrategy({file: filename});
 *
 * @param {Object} options
 * @api public
 */
function Strategy(options) {
  if (options === undefined) {
    options = {};
  }
  if (!options.file) { throw new TypeError('LocalHtpasswdStrategy requires a file option'); }

  this._usernameField = options.usernameField || 'username';
  this._passwordField = options.passwordField || 'password';
  this._file = options.file;

  passport.Strategy.call(this);
  this.name = 'local-htpasswd';
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var username = lookup(req.body, this._usernameField) || lookup(req.query, this._usernameField);
  var password = lookup(req.body, this._passwordField) || lookup(req.query, this._passwordField);

  if (!username || !password) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }

  var self = this;

  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  // Since .htpasswd files are never large, it's okay for performance to
  // read the whole thing. Size is often a max of 16k, so a single I/O is
  // probably all that's needed anyway.
  function verify(username, password, verified) {
    fs.readFile(self._file, function(err, data) {
      if (err) {
        return verified(err, null);
      }
      var string = data.toString('ascii');
      var lines = string.split("\n");
      var lineCount = lines.length;
      var hash = undefined;
      for(var i = 0; i < lineCount; i++) {
        var line = lines[i];
        var values = line.split(':', 2);
        if (values.length != 2 || values[0] != username) {
          continue;
        }
        hash = values[1];

        // Dark magic. Bcrypt hashes made by htpasswd begin $2y$, but they
        // are essentially the same apart from the prefix. So we mod the prefix
        // before comparing.
        hash = '$2a$' + hash.substring(4);
        break;
      }

      if(! hash) {
        return verified(null, false, { message: 'No such user' });
      }
      bcrypt.compare(password, hash || '', function(err, res) {
        if (err) {
          return verified(err, null);
        } else if (! res) {
          return verified(null, false, { message: 'Incorrect password' });
        } else {
          return verified(null, {username: username});
        }
      });
    });
  }

  try {
    verify(username, password, verified);
  } catch (ex) {
    console.log(ex);
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
