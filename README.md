# passport-local-htpasswd

A passport strategy for using bcrypted htpasswd files.  This behaves virtually
identically to passport-local, except that simply specifying a htpasswd is enough
to provide basic authentication. As these files contain no user information, you are
on your own with that. 

This isn't intended as a full production model for authentication. However, it
doesn't require a database and provides a basic and reasonably secure authentication
system with the simplicity of maintenance from the htpasswd command.

Significant portions of this module were derived from `passport-local` by 
Jared Hanson.

#### Usage

The module works with htpasswd files created using bcrypt only. For example, to
create a password file, use a command like this:

    htpasswd -c -B .htpasswd myuser

#### Configure Strategy

The local authentication strategy authenticates users using a username and
password.  The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user.

    passport.use(new LocalHtpasswdStrategy({file: filename});

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'local-htpasswd'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/login', 
      passport.authenticate('local-htpasswd', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });

#### Data 

The module doesn't store or persist users. The user is made available as an
object with a single property `username` with the given username. 
