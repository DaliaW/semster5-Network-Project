module.exports = init

var readFile = require('fs').readFile
var url = require('url')

var moduleMatcher = /(\.min)?\.js$/

function init(path, opts, require) {
	if(!path) throw new Error('Path required as the first parameter')
	if(!require) {
		require = opts
		opts = {}
	}
	if(!require) throw new Error('A require instance is required')

	if(path.substr(-1) == '/') path = path.substring(0, path.length-1)
	if(path[0] != '/') path = '/' + path
	var paramMatcher = new RegExp(path + '/(.+)')
	return function(req, res, next) {
		if(req.method != 'GET' && req.method != 'HEAD') return next()
		var requestedPath = url.parse(req.originalUrl).pathname
		if(requestedPath.indexOf(path) !== 0) return next()
		var param = requestedPath.match(paramMatcher)
		if(!param) return next()

		var file = param[1]
		var moduleName = file.replace(moduleMatcher, '')
		if(opts.paths) {
			if(opts.paths[moduleName]) {
				moduleName = opts.paths[moduleName]
			} else {
				moduleName = moduleName.split('/').reduce(function(combined, component) {
					combined = opts.paths[combined] || combined
					return combined + '/' + component
				})
			}
		}

		var modulePath
		try {
			modulePath = require.resolve(moduleName)
		} catch(e) {
			return res.send(404)
		}

		readFile(modulePath, 'utf8', function(err, content) {
			if(err) return res.send(404)

			if(content[0] == '#') {
				content = '//' + content
			}
			res.set('content-type', 'application/javascript; charset=UTF-8')
			res.send(200, content)
		})
	}
}
