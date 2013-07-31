function Plugin(Sate, subobj) {
    var fs = require('fs');
        extend = require('node.extend');
    var plg = {
        type: 'abstract-base-class',
        version: '0.1.0',
        loadTemplates: function(encoding) {
            if (!this.templatesLoaded) {
                try {
                    var templates = {};
                    for (var t in this.templates) {
                        if (this.templates.hasOwnProperty(t)) {
                            templates[t] = fs.readFileSync(this.templates[t], {encoding: encoding});
                        }
                    }
                    this.templates = templates;
                    this.templatesLoaded = true;
                } catch (err) {
                    console.log( err );
                }
            }
        },
        compile: function(props, page, Sate) {
            return extend(true, this, props);
        },
        extendWithProperties: function(props) {
            for (var p in props) {
                if (props.hasOwnProperty(p)) {
                    if (typeof props[p] == 'object') {
                        this[p] = extend(true, this[p], props[p]);
                    } else {
                        this[p] = props[p];
                    }
                }
            }
        },
        templates: [],
        stylesheets: [],
        scripts: [],
        objectToRender: function(config) {
            return config;
        },
        template: '',
        getRenderer: function() {
            var plugin = this;
            return function() {
                var Mustache = require('mustache');
                return function(config, render) {
                    try { 
                        config = JSON.parse(config);
                    } catch (err) {
                        config = {};
                    }
                    if (plugin.templates.hasOwnProperty('main')) {
                        plugin.template = plugin.templates.main;
                    }
                    var obj = plugin.objectToRender(config, this);
                    if (obj === false) {
                        return '';
                    } else {
                        return Mustache.render(plugin.template, obj, obj.templates);
                    }
                };
            };
        }
    };
    return extend(true, {_super: plg}, plg, subobj);
}
module.exports = Plugin;