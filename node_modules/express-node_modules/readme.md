express-node_modules
====================

A simple [express](http://expressjs.com/) plug-in for delivering libraries from
node_modules to client browsers.


How to use
----------

Setting it up is easy:

	var module = require('express-node_modules')
	app.use(module('/lib', require))

From this point on, any url like `/lib/some-module` will attempt to
load `some-module` with the require-function that was handed in.

The extension is optional, so given the example above, `/lib/some-module` would
return the same module as `/lib/some-module.js`.

It can be given a simple `paths` object if any renaming is necessary:

	app.use(module('/lib', { paths: { 'some-lib': 'real-lib-name' } }, require)

This can be used to make it work with [require.js](http://requirejs.org/), which
is normally delivering a node-module that is not directly browser compatible:

	app.use(module('lib', {
		paths: { 'requirejs': 'requirejs/require/' }
	}, require)
