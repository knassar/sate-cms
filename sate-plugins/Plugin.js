function Plugin(Sate, subobj) {
    var fs = require('fs'),
        extend = require(Sate.nodeModInstallDir+'node.extend');

        var plg = {
        type: subobj.type,
        version: '0.5.0',
        classes: [],
        compile: function(props, page, Sate, complete) {
            complete.apply();
        },
        extendWithProperties: function(props) {
            Sate.chain.inPlace(this, props);
        },
        templates: [],
        stylesheets: [],
        scripts: [],
        objectToRender: function(config, page) {
            var obj;
            if (config.id) {
                obj = page.pluginById(config.id);
            } else if (config.forClass) {
                obj = page.pluginByTypeAndClassName(this.type, config.forClass);
            }
            if (!obj) {
                obj = page.pluginFirstByType(this.type);
            }
            if (obj) {
                obj.extendWithProperties(config);
            }
            return obj;
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
                        if (this.parser == Sate.Parser.Markdown) {
                            try { // Markdown escapes " to &quot;
                                var unmarked = config.replace(/\&quot\;/g, '"');
                                config = JSON.parse(unmarked);
                            }
                            catch (err) {}
                        }
                    }
                    if (!config) {
                        config = {};
                    }
                    else if (typeof config != 'object') {
                        Sate.Log.logAction('failed to parse config for plugin: '+plugin.type+' on page: '+this.url, 2);
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
    
    return extend(true, {super: plg}, plg, subobj);
}
module.exports = Plugin;

