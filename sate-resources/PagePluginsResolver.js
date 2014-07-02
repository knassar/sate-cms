var pluginClassesByType = {};
var pluginTemplatesByType = {};

var resolvePlugin = function(pluginData, resolvedPlugins, page, Sate, complete) {

    var fs = require('fs'),
        path = require('path'),
        flow = require(Sate.nodeModInstallDir+'flow');

    if (pluginData.type) {
        var pluginType = pluginData.type;
    } else {
        throw new Error("cannot resolve plugin declared without 'type' at index: "+idx);
    }
    
    var PluginClass;
    if (pluginClassesByType[pluginType]) {
        PluginClass = pluginClassesByType[pluginType];
    }
    else {
        PluginClass = require(fs.realpathSync(path.join(page.sateSources, 'plugins', pluginType, 'plugin.js')));
        pluginClassesByType[pluginType] = PluginClass;
    }

    var plugin = new PluginClass(Sate);
    
    var compile = function(finishedCompile) {
        flow.exec(
            function() {
                plugin.compile(pluginData, page, Sate, this);
            },
            function() {
                if (!page['plugin-'+pluginType]) {
                    page['plugin-'+pluginType] = plugin.getRenderer();
                }
                plugin.resovled = true;
                for (var s=0; s < plugin.stylesheets.length; s++) {
                    page.addStylesheet(plugin.stylesheets[s]);
                }
                for (var s=0; s < plugin.scripts.length; s++) {
                    page.addScript(plugin.scripts[s]);
                }
                if (plugin.id) {
                    page.pluginsById[plugin.id] = plugin;
                }
                resolvedPlugins.push(plugin);
                // HACK HACK... this avoids a race condition with the end of complile.
                // Not sure why yet
                setTimeout(finishedCompile, 10);
            }
        );
    }
    
    if (pluginTemplatesByType[pluginType]) {
        plugin.templates = pluginTemplatesByType[pluginType];
        plugin.templatesLoaded = true;
        compile(complete);
    }
    else {    
        var templates = {};
    
        var loadPluginTemplate = function(plugin, t, page, loadedTemplate) {
            fs.readFile(plugin.templates[t], {encoding: page.encoding}, function(err, data) {
                templates[t] = data;
                loadedTemplate.apply();
            });
        };
    
        flow.exec(
            function() {
                if (plugin.templatesLoaded) {
                    this.apply();
                }
                var multiCount = 0;
                for (var t in plugin.templates) {
                    if (plugin.templates.hasOwnProperty(t)) {
                        multiCount++;
                        loadPluginTemplate(plugin, t, page, this.MULTI(t));
                    }
                }
                if (multiCount === 0) {
                    this.apply();
                }
            },
            function() {
                plugin.templates = templates;
                pluginTemplatesByType[pluginType] = templates;
                plugin.templatesLoaded = true;
                compile(complete);
            }
        );
    }
};

function PagePluginsResolver(Sate) {
    var flow = require(Sate.nodeModInstallDir+'flow');

    var resolver = this;
    resolver.resolve = function(page, complete) {
        flow.exec(
            function() {
                var resolvedPlugins = [];
                for (var i=0; i < page.plugins.length; i++) {
                    resolvePlugin(page.plugins[i], resolvedPlugins, page, Sate, this.MULTI(page.plugins[i].type));
                }
                page.plugins = resolvedPlugins;
            },
            function() {
                complete.apply();
            }
        );
    };
    return resolver;
}
module.exports = PagePluginsResolver;
