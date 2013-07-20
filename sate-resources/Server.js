(function() {
    var fs = require('fs'),
        connect = require('connect');

    var baseServer = function(website, Sate) {
        var server = connect()
            .use(connect.favicon())
            .use(connect.logger('dev')) // @TODO: use the right log-level
            .use(connect.query());
        return server;
    };

    var RequestTargetType = {
        Javascript: '.js',
        CSS: '.css',
        Page: '*'
    };

    var jsMatcher = /\.js$/;
    var cssMatcher = /\.css$/;
    var determineRequestTargetType = function(req, res) {
        switch (true) {
            case jsMatcher.test(req.url):
                return RequestTargetType.Javascript; 
            case cssMatcher.test(req.url):
                return RequestTargetType.CSS; 
        }
        return RequestTargetType.Page;
    };

    var writeHeadersForType = function(res, type) {
        switch (type) {
            case RequestTargetType.Javascript:
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                break;
            case RequestTargetType.CSS:
                res.writeHead(200, {'Content-Type': 'text/css'});
                break;
            default:
                res.writeHead(200, {'Content-Type': 'text/html'});
        }
    };

    module.exports = {
        DevelopmentServer: function(website, Sate) {
            var server = baseServer(website, Sate);
            server.use(function(req, res) {
                    var type = determineRequestTargetType(req, res);
                    writeHeadersForType(res, type);
                    var respondToReq = function() {
                        res.end(website.pageForPath(req.url).render());
                    };
                    if (type == RequestTargetType.Page) {
                        if (!website.isCompiling) {
                            website.recompile(function(errors) {
                                process.nextTick(respondToReq);
                            }, function(err) {
                                console.error(err);
                                exit(1);
                            });
                        } else {
                            website.performAfterCompile(respondToReq);
                        }
                    } else {
                        res.end(website.resourceForPath(req.url));
                    }
                }).listen(website.siteConfig.port);
            return server;
        },
        ProductionServer: function(website, Sate) {
            var server = baseServer(website, Sate);
            server.use(function(req, res) {
                    var type = determineRequestTargetType(req, res);
                    writeHeadersForType(res, type);
                    if (type == RequestTargetType.Page) {
                        res.end(website.pageForPath(req.url).render());
                    } else {
                        res.end(website.resourceForPath(req.url));
                    }
                }).listen(website.siteConfig.port);
            return server;
        }
    };
}());