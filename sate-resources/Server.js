var fs = require('fs'),
    path = require('path');

var baseServer = function() {
    
    createDefaultRequestHandler();
    
    // @TODO: upgrade to latest version of connect 
    //          need to require all sub-modules individually
    
    var connect = require(Sate.nodeModInstallDir+'connect');
    
    var server = connect()
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

var extensionMatcher = /(\.\w{1,})(?:\?.*)?$/m;

var defaultRequestHandler;

var createDefaultRequestHandler = function() {
    defaultRequestHandler = new Sate.RequestHandler(Sate.RequestHandler.DefaultHandler, {
        typeFromRequest: function(request) {
            var matches = extensionMatcher.exec(request.url);
            if (matches && matches.length > 1) {
                var extension = matches[1];
                for (var type in RequestTargetType) {
                    if (RequestTargetType.hasOwnProperty(type) && RequestTargetType[type] == extension) {
                        return RequestTargetType[type];
                    }
                }
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
        cleanURL: function(request) {
            // @TODO: parse and pass the url query args?
            return request.url.replace(/(?:\?.*)?$/m, '');
        },
        httpCodeForRequest: function(request, website) {
            var type = this.typeFromRequest(request);
            var url = this.cleanURL(request);
            if (type == RequestTargetType.Page) {
                return website.hasPageForPath(url) ? 200 : 404;
            } else {
                return website.hasResourceForPath(url) ? 200 : 404;
            }
        },
        handleRequest: function(request, website, deliverResponse) {
            var type = this.typeFromRequest(request);
            
            var url = this.cleanURL(request);
            
            if (type == RequestTargetType.Page) {
                // HACK HACK... this avoids a race condition with the end of complile.
                // Not sure why yet
                setTimeout(function() {
                    deliverResponse(website.pageForPath(url).render());
                }, 25);
            } else {
                deliverResponse(website.resourceForPath(url));
            }
        }
    });   
};

var handlerForRequest = function(request) {
    for (var pattern in Sate.resourceRequestHandlers) {
        if (Sate.resourceRequestHandlers.hasOwnProperty(pattern) && 
            Sate.resourceRequestHandlers[pattern].pattern.test(request.url)) {

            return Sate.resourceRequestHandlers[pattern].handler;
        }
    }
    return defaultRequestHandler;
};

module.exports = {
    DevelopmentServer: function() {
        var server = baseServer();
        var website = Sate.currentSite;
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
    StaticServer: function() {
        var server = baseServer();
        var website = Sate.currentSite;
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
