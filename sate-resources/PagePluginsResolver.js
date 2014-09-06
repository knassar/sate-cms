var pluginClassesByType = {};
var pluginTemplatesByType = {};

var deployPluginStyleSheetURL = "/styles/sate-plugins.css";
var deployPluginScriptURL = "/scripts/sate-plugins.js";

var initializePluginInDir = function(pluginType, pluginsDir) {
    var path = require('path');
    
    var plugin;
    try {
        PluginClass = require(path.join(pluginsDir, pluginType, 'plugin.js'));
        plugin = new PluginClass();
    }
    catch (err) {
        Sate.Log.logError('could not import plugin '+pluginType, 2);
    }
    return plugin;
};

var resolvePlugin = function(pluginData, resolvedPlugins, page, complete) {

    var fs = require('fs'),
        path = require('path'),
        flow = require(Sate.nodeModInstallDir+'flow');

    if (pluginData.type) {
        var pluginType = pluginData.type;
    } else {
        throw new Error("cannot resolve plugin declared without 'type' at index: "+idx);
    }
    var pluginPath = path.join(page.sateSources, 'plugins', pluginType);

    var PluginClass;
    if (pluginClassesByType[pluginType]) {
        PluginClass = pluginClassesByType[pluginType];
    }
    else {
        PluginClass = require(fs.realpathSync(path.join(pluginPath, 'plugin.js')));
        pluginClassesByType[pluginType] = PluginClass;
    }

    var plugin = new PluginClass();
    
    var compile = function(finishedCompile) {
        flow.exec(
            function() {
                plugin.compile(pluginData, page, this);
            },
            function() {
                if (!page['plugin-'+pluginType]) {
                    page['plugin-'+pluginType] = plugin.getRenderer();
                }
                plugin.resovled = true;
                if (Sate.executingCommand == 'deploy') {
                    page.addStylesheet(deployPluginStyleSheetURL);
                    page.addScript(deployPluginScriptURL);
                }
                else {
                    for (var s=0; s < plugin.stylesheets.length; s++) {
                        page.addStylesheet('/'+path.join(pluginPath, plugin.stylesheets[s]));
                    }
                    for (var s=0; s < plugin.scripts.length; s++) {
                        page.addScript('/'+path.join(pluginPath, plugin.scripts[s]));
                    }
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
            var templatePath = path.join(pluginPath, plugin.templates[t]);
            fs.readFile(templatePath, {encoding: page.encoding}, function(err, data) {
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

function PagePluginsResolver() {
    var flow = require(Sate.nodeModInstallDir+'flow');

    var resolver = this;
    resolver.resolve = function(page, complete) {
        var resolvedPlugins = [];
        flow.serialForEach(page.plugins,
            function(plugin, idx) {
                resolvePlugin(plugin, resolvedPlugins, page, this);
            },
            function(error, newVal) {
				if (error) {
	            	Sate.Log.logError(error, 1);
				}
            },
            function() {
                page.plugins = resolvedPlugins;
                complete.apply();
            }
        );
    };
    resolver.allInstalledPlugins = function(complete) {
        var fs = require('fs'),
            path = require('path'),
            flow = require(Sate.nodeModInstallDir+'flow');

        var pluginsDir = fs.realpathSync(path.join(Sate.currentSite.sateSources, 'plugins'));
        var files;
        var plugins = [];
        try {
            files = fs.readdirSync(pluginsDir, this);

                
            files.forEach(function(filename) {
                var stats = fs.statSync(path.join(pluginsDir, filename));
                if (stats.isDirectory()) {
                    var plugin = initializePluginInDir(filename, pluginsDir);
                    if (plugin) {
                        plugins.push(plugin);
                    }
                }
            });
        }
        catch (err) {
            Sate.Log.logError("couldn't load plugins", 2);
        }
        
        complete(plugins);
    };
    resolver.resourcesDirForPlugin = function(plugin) {
        var fs = require('fs'),
            path = require('path');

        return fs.realpathSync(path.join(Sate.currentSite.sateSources, 'plugins', plugin.type));
    }
    return resolver;
}

PagePluginsResolver.deployPluginStyleSheetURL = deployPluginStyleSheetURL;
PagePluginsResolver.deployPluginScriptURL = deployPluginScriptURL;

module.exports = PagePluginsResolver;
