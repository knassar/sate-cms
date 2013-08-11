var fs = require('fs'),
    path = require('path'),
    flow = require('flow');

var resolvePlugin = function(idx, page, Sate, complete) {
    if (page.plugins[idx].type) {
        var pluginType = page.plugins[idx].type;
    } else {
        throw new Error("cannot resolve plugin declared without 'type' at index: "+idx);
    }
    var PluginClass = require(fs.realpathSync(path.join(page.sateSources, 'plugins', pluginType, 'plugin.js')));
    var plugin = new PluginClass(Sate);
    var templates = {};
    flow.exec(
        function() {
            if (plugin.templatesLoaded) {
                this.apply();
            }
            var multiCount = 0;
            var thisFlow = this;
            for (var t in plugin.templates) {
                if (plugin.templates.hasOwnProperty(t)) {
                    fs.readFile(plugin.templates[t], {encoding: page.encoding}, function(err, data) {
                        templates[t] = data;
                        thisFlow.MULTI(t).apply();
                    });
                    multiCount++;
                }
            }
            if (multiCount === 0) {
                this.apply();
            }
        },
        function() {
            plugin.templates = templates;
            plugin.templatesLoaded = true;
            this.apply();
        },
        function() {
            plugin.compile(page.plugins[idx], page, Sate, this);
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
                page.plugins[plugin.id] = plugin;
            }
            page.plugins[idx] = plugin;
            complete.apply();
        }
    );
};

function PagePluginsResolver(Sate) {
    var resolver = this;
    resolver.resolve = function(page, complete) {
        flow.exec(
            function() {
                for (var i=0; i < page.plugins.length; i++) {
                    if (!page.plugins[i].resolved) {
                        resolvePlugin(i, page, Sate, this.MULTI(page.plugins[i].type));
                    }
                }
            },
            function() {
                complete.apply();
            }
        );
    };
    return resolver;
}
module.exports = PagePluginsResolver;
