function Plugin(Sate, subobj) {
    var fs = require('fs'),
        extend = require(Sate.nodeModInstallDir+'node.extend');

        var plg = {
        type: 'abstract-base-class',
        version: '0.2.0',
        classes: [],
        compile: function(props, page, Sate, complete) {
            complete.apply();
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
                var Mustache = require(Sate.nodeModInstallDir+'mustache');
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

    Sate.configForPlugin(subobj.type);
    
    return extend(true, {_super: plg}, plg, subobj);
}
module.exports = Plugin;

