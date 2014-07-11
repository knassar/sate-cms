(function() {
    var fs = require('fs'),
        path = require('path');

    var baseServer = function(website) {
        // @TODO: upgrade to latest version of connect 
        //          need to require all sub-modules individually
        
        var connect = require(Sate.nodeModInstallDir+'connect');
        
        var server = connect()
            .use(connect.favicon(path.join(website.sitePath, 'favicon.ico')))
            .use(connect.logger('dev')) // @TODO: use the right log-level
            .use(connect.query());
        return server;
    };
    
    var RequestTargetType = {
        Javascript: '.js',
        CSS: '.css',
        ICO: '.ico',
        PNG: '.png',
        JPG: '.jpg',
        GIF: '.gif',
        Page: '*'
    };

    var jsMatcher = /\.js$/;
    var cssMatcher = /\.css$/;
    var icoMatcher = /\.ico$/;
    var jpgMatcher = /\.jpg|\.jpeg|\.jpe$/;
    var pngMatcher = /\.png$/;
    var gifMatcher = /\.gif$/;
    
    var defaultRequestHandler = {
        typeFromRequest: function(request) {
            switch (true) {
                case jsMatcher.test(request.url):
                    return RequestTargetType.Javascript; 
                case cssMatcher.test(request.url):
                    return RequestTargetType.CSS; 
                case icoMatcher.test(request.url):
                    return RequestTargetType.ICO; 
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
                case RequestTargetType.ICO:
                    headers['Content-Type'] = 'image/x-icon';
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
        httpCodeForRequest: function(request, website) {
            var type = this.typeFromRequest(request);
            
            if (type == RequestTargetType.Page) {
                return website.hasPageForPath(request.url) ? 200 : 404;
            } else {
                return website.hasResourceForPath(request.url) ? 200 : 404;
            }
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
    
    var handlerForRequest = function(request) {
        for (var requestMatcher in Sate.resourceRequestHandlers) {
            if (Sate.resourceRequestHandlers.hasOwnProperty(requestMatcher) && 
                Sate.resourceRequestHandlers[requestMatcher].matcher.test(request.url)) {

                return Sate.resourceRequestHandlers[requestMatcher].handler;
            }
        }
        return defaultRequestHandler;
    };

    module.exports = {
        DevelopmentServer: function(website) {
            var server = baseServer(website);
            server.use(function(req, res) {
                
                var handler = handlerForRequest(req);
                
                var headers = handler.headersForRequest(req);
                
                var code = handler.httpCodeForRequest(req, website);
                
                res.writeHead(code, headers);
                
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
        ProductionServer: function(website) {
            var server = baseServer(website);
            server.use(function(req, res) {
                
                var handler = handlerForRequest(req);
                var code = handler.httpCodeForRequest(req, website);
                
                res.writeHead(code, handler.headersForRequest(req));
                handler.handleRequest(req, website, function(response) {
                    res.end(response);
                });

            }).listen(website.args.port);
            return server;
        }
    };
}());