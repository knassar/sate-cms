/**
* Hello World!
* A template for creating a plugin
**/
module.exports = function(Sate) {
    
    // private properties and methods that should be accessible at both compile- and render-time:
    var supportedLangs = ['english', 'spanish', 'german', 'latin'];
    var languageSupported = function(lang) {
        return (supportedLangs.indexOf(lang) > -1);
    };

    return {
        // if your plugin needs to do build-time work, implement that here
        // it will be passed configuration properties from the website.json or 
        // pageData block, the current compiled page, and the Sate object.
        // 
        // It should return a compiled plugin object.
        compiler: function(props, page, Sate) {
            // private properties, methods, and requires go here
            var extend = require('node.extend');
            
            var hello = extend(true, this, {
                // default configs
                language: "english"
            },
            page, // the page data will be merged on top of defaults
            props, // the pageData config for this module merged next
            { // put here public properties or methods that should not be overridden
                init: function() {
                    if (!languageSupported(this.language)) {
                        this.language = supportedLangs[0];
                    }
                }
            });
    
            hello.init();
            return hello;
        },
        // any plugin that needs to output visible content must include a renderer
        renderer: function() {
            // a renderer is a function which returns a Mustache block function
            // it is executed in the context of the Page, so the compiled plugin is accessible through 'this.plugins' array
            // any plugin given an id property is accessible through: 'this.plugins[id]'
            return function(config, render) {
                // config is the data inside the Mustache function block.
                // usually a JSON object passed into the renderer for you to parse
                try {
                    config = JSON.parse(config);
                } catch (err) {
                    config = {};
                }
                
                // if no language provided, figure out which language to use
                if (!config.language && this.plugins) {
                    // we can access the compiled plugin directly via id if there is one:
                    if (config.id && this.plugins[config.id]) {
                        config.language = this.plugins[config.id].language;
                    } else {
                        // OR via the this.plugins array:
                        for (var i=0; i < this.plugins.length; i++) {
                            if (this.plugins[i].type == 'hello-world') {
                                config.language = this.plugins[i].language;
                                // NOTE: there may be more than one of a given type declared for the page!
                                break; // we'll just use the first one we find
                            }
                        }
                    }
                } else {
                    if (!languageSupported(config.language)) {
                        config.language = supportedLangs[0];
                    }
                }
                // output the appropriate content
                switch (config.language) {
                    case 'english':
                        return "<strong>Hello World!</strong>";
                    case 'spanish':
                        return "<strong>Hola Mundo!</strong>";
                    case 'german':
                        return "<strong>Hallo Welt!</strong>";
                    case 'latin':
                        return "<strong>Salve Mundi!</strong>";
                }
            };
        }
    };
};
