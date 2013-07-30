var fs = require('fs'),
    path = require('path'),
    util = require('util');

var resolveArticleSort = function(page, Sate) {
    if (typeof page.articleSort == 'string') {
        var parts = page.articleSort.split('.');
        if (parts.length == 3 && parts[0] == 'Sate' && parts[1] == 'IndexSort') {
            page.articleSort = Sate.IndexSort[parts[2]]; 
        }
    }
};

var resolvePageType = function(page, Sate) {
    if (!page.type) {
        if (typeof page.subPages == 'object') {
            page.type = Sate.PageType.Index;
        } else {
            page.type = Sate.PageType.Article;
        }
    } else if (typeof page.type == 'string') {
        var parts = page.type.split('.');
        if (parts.length == 3 && parts[0] == 'Sate' && parts[1] == 'PageType') {
            page.type = parts[2].toLowerCase(); 
        }
    }
    if (page.type == Sate.PageType.Index) {
       resolveArticleSort(page, Sate);
    }
};

var resolvePlugins = function(page, Sate) {
    var resolvedPlugins = [];
    var pluginPath = function(type) {
        return fs.realpathSync(path.join(page.sateSources, 'plugins', type, 'plugin.js'));
    };
    var i;
    for (i=0; i < page.plugins.length; i++) {
        if (!page.plugins[i].resolved) { // skip already-resolved plugins
            if (!page.plugins[i].type) throw new Error("cannot resolve plugin declared without 'type' at index: "+i);
            var PluginClass = require(pluginPath(page.plugins[i].type));
            var plugin = new PluginClass(Sate);
            plugin.loadTemplates(page.encoding);
            plugin.compile(page.plugins[i], page, Sate);
            if (!page['plugin-'+page.plugins[i].type]) {
                page['plugin-'+page.plugins[i].type] = plugin.getRenderer();
            }
            plugin.resovled = true;
            for (var s=0; s < plugin.stylesheets.length; s++) {
                page.addStylesheet(plugin.stylesheets[s]);
            }
            for (var s=0; s < plugin.scripts.length; s++) {
                page.addScript(plugin.scripts[s]);
            }
            resolvedPlugins.push(plugin);
            if (plugin.id) {
                resolvedPlugins[plugin.id] = plugin;
            }
        }
    }
    return resolvedPlugins;
};

var dateProps = [
    'date',
    'created',
    'modified'
];
var resolveDate = function(dateProp, page) {
    page[dateProp] = new Date(page[dateProp]);
};

function PageDataResolver(Sate) {
    var resolver = this;
    resolver.resolve = function(page) {
        // resolve PageType constant
        resolvePageType(page, Sate);
        for (var prop in page) {
            if (prop == 'plugins' && util.isArray(page[prop])) {
                page.plugins = resolvePlugins(page, Sate);
            } else if (dateProps.indexOf(prop) > -1 && typeof page[prop] == 'string') {
                resolveDate(prop, page);
            }
        }
        
    };
    return resolver;
}
module.exports = PageDataResolver;
