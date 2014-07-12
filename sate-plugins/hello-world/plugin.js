/**
* Hello World!
* A template for creating a plugin
**/
module.exports = function() {
    // private properties and methods that should be accessible at both compile- and render-time:
    var supportedLangs = ['english', 'spanish', 'german', 'latin'];
    var languageSupported = function(lang) {
        return (supportedLangs.indexOf(lang) > -1);
    };

    // create a plugin instance as a sub-class of Plugin
    var plg = new Sate.Plugin({
        // the 'type' property must match the directory name
        type: 'hello-world',
        
        // the version of the plugin code
        version: '0.6.0',
        
        // default config properties go here
        language: "english",
        
        // the compile method, 
        compile: function(props, page, complete) {
            // do any configuration or defaulting here
            if (!languageSupported(this.language)) {
                this.language = supportedLangs[0];
            }
            
            // extend this plugin instance with any pageData-level defines:
            Sate.chain.inPlace(this, props);
            
            // completion callback
            complete.apply();
        },
        
        // these resource paths must be relative paths to the plugin's directory
        // for example: 'some-stylesheet.css'
        
        // your templates go here. They will be loaded automatically before compile is called. The primary template must be named 'main'.
        templates: {'main': 'hello-world.tpl'},

        // list any client-side stylesheet or script dependencies here... they will be added to the page.
        stylesheets: [],
        scripts: [],

        // generally, you won't implement the getRenderer method, 
        // instead you provide an object to the render phase by implementing objectToRender:
        // if you want to render nothing, return false
        objectToRender: function(config, page) {
            // attempt to identify which plugin is referenced by config
            var obj = this.prototype.objectToRender.call(this, config, page);
            
            if (!obj) {
                // if we didn't want to have a default behavior, we would just return false here
                obj = {};
            }

            var language = (config.language) ? config.language : obj.language;
            // if you want to render using a template other than 'this.templates.main', then set 'this.template' here.
            // set up any object data for the render pass here:
            switch (language) {
                case 'spanish':
                    obj.hello = "Hola Mundo!";
                    break;
                case 'german':
                    obj.hello = "Hallo Welt!";
                    break;
                case 'latin':
                    obj.hello = "Salve Mundi!";
                    break;
                case 'english':
                    // annotation for jshint
                    /* falls through */
                default:
                    obj.hello = "Hello World!";
            }
            
            // return the object for the template render
            return obj;
        }
    });
    
    // return the plugin instance
    return plg;
};
