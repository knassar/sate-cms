@intro:

This plugin is a Sate-plugin wrapper around the classic [Jottings Email Obfuscator](http://www.jottings.com/obfuscator/).

@content:

To use this plugin, simply include the following wherever you want the `mailto` link to appear:

{{=<% %>=}}


    {{#plugin-sate-mailto}}
    {
        "mailto": "my.email@address.com"
    }
    {{/plugin-sate-mailto}}


To avoid unwanted whitespace, you can declare this inline as well:

    Email me: {{#plugin-sate-mailto}}{"mailto": "my.email@address.com"}{{/plugin-sate-mailto}}. Blah blah blah.


<%={{ }}=%>


### Properties

The following properties can be used to adjust the default behavior of the MailTo plugin:

#### `mailto` <span class="type string">String</span>

The target email address. This is required, and will be obfuscated to confound spam harvesters.

#### `linkText` <span class="type string">String</span>

This text if provided will be used as the text content of the `mailto` tag. This text is **not** obfuscated, so only include non-email text here. If you wish the `mailto` link text to be the email address, simply leave this property out.

#### `subject` <span class="type string">String</span>

A Subject line for the resulting email.

#### `noScriptText` <span class="type string">String</span>

Text to display in cases where the browser has JavaScript disabled.

### License Info

    // Email obfuscator script 2.1 by Tim Williams, University of Arizona
    // Random encryption key feature by Andrew Moulden, Site Engineering Ltd
    // This code is freeware provided these four comment lines remain intact
    // A wizard to generate this code is at http://www.jottings.com/obfuscator/

