# passport-local-htpasswd

A passport strategy for using bcrypted htpasswd files.  This behaves virtually
identically to passport-local, except that simply specifying a htpasswd is enough
to provide basic authentication. As these files contain no user information, you are
on your own with that. 

This isn't intended as a full production model for authentication. However, it
doesn't require a database and provides a basic and reasonably secure authentication
system with the simplicity of maintenance from the htpasswd command.

