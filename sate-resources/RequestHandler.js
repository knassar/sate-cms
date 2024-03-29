
function valid(properties) {
    return (properties.headersForRequest && typeof properties.headersForRequest == 'function' &&
            properties.httpCodeForRequest && typeof properties.httpCodeForRequest == 'function' &&
            properties.handleRequest && typeof properties.handleRequest == 'function');
}

function RequestHandler(requestPattern, properties) {

    if (!valid(properties)) {
        Sate.Log.failWith("Invalid RequestHandler sub-type");
    }

    this.prototype = RequestHandler.prototype;

    Sate.chain.inPlace(this, properties);
    
    this.requestPattern = requestPattern;
    
    if (Sate.executingCommand == 'deploy') {
        Sate.Log.logError("Cannot register RequestHandler during Deploy directive. Skipping.", 1);
    }
    else if (requestPattern == RequestHandler.DefaultHandler) {
        // don't register the default handler
        return;
    }
    else if (requestPattern) {
        Sate.registerRequestHandler(this);
    }
    else {
        Sate.Log.logError("Could not register RequestHandler. 'requestPattern' not defined.", 1);
    }
}

RequestHandler.DefaultHandler = "Sate.DefaultRequestHandler";

RequestHandler.prototype = {
    headersForRequest: function(request) {
        headers = {
            'Content-Type': 'text/text'
        };
        return headers;
    },
    httpCodeForRequest: function(request) {
        return 400;
    },
    handleRequest: function(request, deliverResponse) {
        deliverResponse("Sate.RequestHandler not implemented for request: '"+ request.url +"'");
    }
};

module.exports = RequestHandler;