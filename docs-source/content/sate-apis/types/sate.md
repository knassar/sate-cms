{
    "classes": ["api-doc"]
}

@intro:

The Sate object is a singleton available to all code in the running application. It's primary purpose is to contain compile-time and render-time references to the current page, the current website, and various enumerations, configurations, and utilities.

The Sate object should be treated as a read-only object. Unless otherwise specified in these docs, modifying any properties of the Sate object directly can result in unpredictable behavior.

@content:

## Properties

The following properties are available on the Sate singleton.

### <a name="pageType"></a>`PageType` <span class="type enum">Enum</span>

The enumeration of valid Page Types.

### <a name="parser"></a>`Parser` <span class="type enum">Enum</span>

The enumeration of valid content Parsers.


### <a name="indexSort"></a>`IndexSort` <span class="type enum">Enum</span>

The enumeration of valid Index Sort methods.


### <a name="executingCommand"></a>`executingCommand` <span class="type string">String</span>

The name of the Sate directive which is currently executing. This is useful for plugins which need to perform different behavior during `deploy` vs `develop`.


### <a name="currentSite"></a>`currentSite` <a class="type sate" href="/sate-apis/types/website">Website</a>

A reference to the currently compiled [Sate.Website](/sate-apis/types/website) instance. This is useful for plugins which need to access content from pages other than the current page at compile-time.


### <a name="log"></a>`Log` <span class="type object">Object</span>

The Sate Logger. Going through the Sate.Log methods ensures that log messaging conforms to the users's logging verbosity settings. Available log methods are:

#### `logAction(message, depth)`

| Arguments | |
|:-|-|
|`message`| <span class="type string">String</span>|
|`depth`| <span class="type number">Number</span>|

Outputs `message` to the console, indented according to `depth`. Use this to provide feedback to users during compilation. 

#### `logError(message, depth)`

| Arguments | |
|:-|-|
|`message`| <span class="type string">String</span>|
|`depth`| <span class="type number">Number</span>|

Outputs `message` to the console as an error, indented according to `depth`. Use this to provide feedback to users on non-fatal errors during compilation. 

#### `failWith(message)`

| Arguments | |
|:-|-|
|`message`| <span class="type string">String</span>|

Outputs `message` to the console as a fatal error, and exits Sate.


### <a name="utils"></a>`utils` <span class="type object">Object</span>

A bundle of assorted utility methods:

#### `toTitleCase(filename, lowerWords)`<span class="arrow r"></span>  <span class="type string">String</span>

| Arguments | |
|:-|-|
|`filename`| <span class="type string">String</span>|
|`lowerWords`| <span class="type array">Array</span>|

This is the method converts a string to Title Case. Any words passed in the `lowerWords` array are not converted to upper-case if they are not the first word in the filename. The default set of `lowerWords` is: "the, of, and, in, from".

#### `pageNameFromFileName(filename, lowerWords)`<span class="arrow r"></span>  <span class="type string">String</span>

| Arguments | |
|:-|-|
|`filename`| <span class="type string">String</span>|
|`lowerWords`| <span class="type array">Array</span>|

This is the method that Sate uses to infer page names from file names. Any words passed in the `lowerWords` array are not converted to upper-case if they are not the first word in the filename. The default set of `lowerWords` is: "the, of, and, in, from".

#### `ensurePath(filepath)`

| Arguments | |
|:-|-|
|`filepath`| <span class="type string">String</span>|

Recusively traverses the given filepath, creating directories for any that are missing. This is useful to avoid errors when a plugin must write content to disk.

#### `md5(string)`<span class="arrow r"></span>  <span class="type string">String</span>

| Arguments | |
|:-|-|
|`string`| <span class="type string">String</span>|

Returns an MD5 hash of the string.



## Methods

### <a name="pageDescriptor"></a>`pageDescriptor(value) `<span class="arrow r"></span>  <a class="type sate" href="/sate-apis/types/page-descriptor">Page Descriptor</a> | <span class="type null">NULL</span>

| Arguments | |
|:-|-|
|`value`| <span class="type object">Object</span> &#124; <span class="type string">String</span>|

This method normalizes the value passed to it. The return result of this method is either a fully formed [Page Descriptor](/sate-apis/types/page-descriptor) object, or `null` if the argument could not be resolved to a valid descriptor.

### <a name="chain"></a>`chain(obj1, obj2, ...) `<span class="arrow r"></span>  <span class="type object">Object</span>

| Arguments | |
|:-|-|
|`obj1`| <span class="type object">Object</span>|
|`obj2`| <span class="type object">Object</span>|
|`...`| <span class="type object">Object</span>|

This method executes the [Sate Chain](/docs/the-chain) operation by merging `obj2` onto `obj1`, and so on for as many arguments as are passed in. It returns an object which is the result of merging down all arguments according to the rules of the Chain.

#### <a name="chainInPlace"></a>`chain.inPlace(merged, obj2, ...) `

| Arguments | |
|:-|-|
|`merged`| <span class="type object">Object</span>|
|`obj2`| <span class="type object">Object</span>|
|`...`| <span class="type object">Object</span>|

This method is similar to `Sate.chain()` but instead of returning a new merged object, merges arguments into the `merged` object directly. The `merged` object will contain the resulting merged properties.

### <a name="configForPlugin"></a>`configForPlugin(pluginType) `<span class="arrow r"></span>  <span class="type object">Object</span>

| Arguments | |
|:-|-|
|`pluginType`| <span class="type string">String</span>|

Provides a common configuration store for plugin use. This configuration space is unrelated to the user plugin configuration. The purpose of this method is to provide Plugin authors a long-lived storage area for internal implementation parameters, configuration, or results that all instances of a given plugin type may wish to access. 

For example, if a plugin needs to perform an expensive computation during compilation that will be shared across all instances, the results of the computation can be stored in the Sate pluginConfig object and retrieved by other instances.

To use the shared plugin config store, call `Sate.configForPlugin` with the plugin type as the single argument. The return value is an object reference which can be populated with any properties you wish.


{{{plugin-sate-sequenceNav}}}

