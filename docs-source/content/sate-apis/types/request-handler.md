{
    "classes": ["api-doc"]
}

@intro:

<p class="todo">This page is incomplete</p>

The RequestHandler is a specialized type that most developers will not need to deal with. However, in certain specialized cases, implementing a RequestHandler sub-type can allow a plugin to intercept URL requests from the `develop` server and provide a specialized response.

@content:

When implementing a RequestHandler, you must implement 

### Extending Sate.RequestHandler



### Methods

#### <a name="headersForRequest"></a>`headersForRequest(request)` <span class="arrow r"></span> <span class="type object">Object</span>

| Arguments | |
|:-|-|
|`request`| <span class="type object">Object</span>|



#### <a name="httpCodeForRequest"></a>`httpCodeForRequest(request)` <span class="arrow r"></span> <span class="type number">Number</span>

| Arguments | |
|:-|-|
|`request`| <span class="type object">Object</span>|



#### <a name="handleRequest"></a>`handleRequest(request, deliverResponse)`

| Arguments | |
|:-|-|
|`request`| <span class="type object">Object</span>|
|`deliverResponse`| <span class="type function">Function</span>|




{{{plugin-sate-sequenceNav}}}

