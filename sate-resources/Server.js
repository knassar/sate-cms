(function() {
    var fs = require('fs');

    var baseServer = function(website, Sate) {
        // @TODO: upgrade to latest version of connect 
        //          need to require all sub-modules individually
        
        var connect = require(Sate.nodeModInstallDir+'connect');
        
        var server = connect()
            .use(connect.favicon())
            .use(connect.logger('dev')) // @TODO: use the right log-level
            .use(connect.query());
        return server;
    };

    var defaultRequestHandler = {
        typeFromRequest: function(request) {
            switch (true) {
                case jsMatcher.test(request.url):
                    return RequestTargetType.Javascript; 
                case cssMatcher.test(request.url):
                    return RequestTargetType.CSS; 
                case jpgMatcher.test(request.url):
                    return RequestTargetType.JPG; 
                case pngMatcher.test(request.url):
                    return RequestTargetType.PNG; 
                case gifMatcher.test(request.url):
                    return RequestTargetType.GIF; 
            }
            return RequestTargetType.Page;
        },
        headersForRequest: function(request) {
            headers = {
                'Content-Type': ''
            };
            switch (this.typeFromRequest(request)) {
                case RequestTargetType.Javascript:
                    headers['Content-Type'] = 'text/javascript';
                    break;
                case RequestTargetType.CSS:
                    headers['Content-Type'] = 'text/css';
                    break;
                case RequestTargetType.JPG:
                    headers['Content-Type'] = 'image/jpeg';
                    break;
                case RequestTargetType.PNG:
                    headers['Content-Type'] = 'image/png';
                    break;
                case RequestTargetType.GIF:
                    headers['Content-Type'] = 'image/gif';
                    break;
                default:
                    headers['Content-Type'] = 'text/html';
            }
            return headers;
        },
        handleRequest: function(request, website, deliverResponse) {
            var type = this.typeFromRequest(request);
            
            if (type == RequestTargetType.Page) {
                // HACK HACK... this avoids a race condition with the end of complile.
                // Not sure why yet
                    setTimeout(function() {
                        deliverResponse(website.pageForPath(request.url).render());
                    }, 25);
            } else {
                deliverResponse(website.resourceForPath(request.url));
            }
        }
    };
    
    var handlerForRequest = function(request, Sate) {
        for (var requestMatcher in Sate.resourceRequestHandlers) {
            if (Sate.resourceRequestHandlers.hasOwnProperty(requestMatcher) && 
                Sate.resourceRequestHandlers[requestMatcher].matcher.test(request.url)) {

                return Sate.resourceRequestHandlers[requestMatcher].handler;
            }
        }
        return defaultRequestHandler;
    };

    var RequestTargetType = {
        Javascript: '.js',
        CSS: '.css',
        PNG: '.png',
        JPG: '.jpg',
        GIF: '.gif',
        Page: '*'
    };

    var jsMatcher = /\.js$/;
    var cssMatcher = /\.css$/;
    var jpgMatcher = /\.jpg|\.jpeg|\.jpe$/;
    var pngMatcher = /\.png$/;
    var gifMatcher = /\.gif$/;
    var determineRequestTargetType = function(req, res) {
        switch (true) {
            case jsMatcher.test(req.url):
                return RequestTargetType.Javascript; 
            case cssMatcher.test(req.url):
                return RequestTargetType.CSS; 
            case jpgMatcher.test(req.url):
                return RequestTargetType.JPG; 
            case pngMatcher.test(req.url):
                return RequestTargetType.PNG; 
            case gifMatcher.test(req.url):
                return RequestTargetType.GIF; 
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
            case RequestTargetType.JPG:
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                break;
            case RequestTargetType.PNG:
                res.writeHead(200, {'Content-Type': 'image/png'});
                break;
            case RequestTargetType.GIF:
                res.writeHead(200, {'Content-Type': 'image/gif'});
                break;
            default:
                res.writeHead(200, {'Content-Type': 'text/html'});
        }
    };

    module.exports = {
        DevelopmentServer: function(website, Sate) {
            var server = baseServer(website, Sate);
            server.use(function(req, res) {
                
                var handler = handlerForRequest(req, Sate);
                
                var headers = handler.headersForRequest(req);
                
                res.writeHead(200, headers);
                
                var handleRequest = function() {
                    handler.handleRequest(req, website, function(response) {
                        res.end(response);
                    });
                };
                
                if (handler == defaultRequestHandler && headers['Content-Type'] == 'text/html') {
                    website.recompile(true, handleRequest);
                }
                else {
                    handleRequest.apply();
                }
                
                }).listen(website.args.port);
            return server;
        },
        ProductionServer: function(website, Sate) {
            var server = baseServer(website, Sate);
            server.use(function(req, res) {
                
                var handler = handlerForRequest(req, Sate);
                
                res.writeHead(200, handler.headersForRequest(req));
                handler.handleRequest(req, website, function(response) {
                    res.end(response);
                });

            }).listen(website.args.port);
            return server;
        }
    };
}());