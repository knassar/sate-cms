{
    "classes": ["api-doc"]
}

@intro:

The RequestHandler is a specialized type that most developers will not need to deal with. However, in certain specialized cases, implementing a RequestHandler sub-type can allow a plugin to intercept URL requests from the `develop` server and provide a specialized response.

@content:


## Extending Sate.RequestHandler

The `Sate.RequestHandler()` constructor is used to create your own implementation of RequestHandler:

### <a name="constructor"></a>`Sate.RequestHandler(requestPattern, implementation)` <span class="arrow r"></span> <span class="type sate">Sate.RequestHandler</span>

| Arguments | |
|:-|-|
|`requestPattern`| <span class="type regex">Regular Expression</span>|
|`implementation`| <span class="type object">Object</span>|

To use the `Sate.RequestHandler` constructor, you call it with `new` and pass in a Regular Expression and an Object which implements (at minimum) the three methods below. The constructor sets the prototype of the object you pass in to the Sate.RequestHandler prototype, and registers the new handler for requests matched by the `requestPattern` argument.

An example of an implementaion:

    var myRequestHandler = new Sate.RequestHandler(/\.pdf$/mi, {
            headersForRequest: function(request) {
                //... 
            },
            httpCodeForRequest: function(request) {
                //... 
            },
            handleRequest: function(request, deliverResponse) {
                //... 
            }                
        });


## Methods to Implement

When implementing a RequestHandler, you must implement the following methods:

### <a name="headersForRequest"></a>`headersForRequest(request)` <span class="arrow r"></span> <span class="type object">Object</span>

| Arguments | |
|:-|-|
|`request`| <span class="type object">Object</span>|

This method must return any HTTP response headers necessary for the content you will return for the request. 

For our PDF example above, we would return the following, at a minimum:

    {
        'Content-Type': 'application/pdf'
    }

### <a name="httpCodeForRequest"></a>`httpCodeForRequest(request)` <span class="arrow r"></span> <span class="type number">Number</span>

| Arguments | |
|:-|-|
|`request`| <span class="type object">Object</span>|

This method must return a valid HTTP response code for the request.

### <a name="handleRequest"></a>`handleRequest(request, deliverResponse)`

| Arguments | |
|:-|-|
|`request`| <span class="type object">Object</span>|
|`deliverResponse`| <span class="type function">Function</span>|

In this method, you should do whatever work needs to be done to construct the appropriate response, and deliver the response by calling the `deliverResponse` callback. 

For example:

    handleRequest(request, deliverResponse) {
        var pdf = this.buildPDFForURL(request.url);
        deliverResponse(pdf);
    }


{{{plugin-sate-sequenceNav}}}

