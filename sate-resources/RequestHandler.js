function RequestHandler(requestPattern, properties) {

    Sate.chain.inPlace(this, properties);
    
    this.requestPattern = requestPattern;
    
    if (requestPattern) {
        if (requestPattern != RequestHandler.DefaultHandler) {
            Sate.registerRequestHandler(this);
        }
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