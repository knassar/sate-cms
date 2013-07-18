var util = require('util');

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
};

var resolvePlugins = function(page, Sate) {
    var resolvedPlugins = [];
    var pluginPath = function(type) {
        return './plugins/'+type+'/plugin.js';
    };
    for (var i=0; i < page.plugins.length; i++) {
        if (page.plugins[i].resolved) continue; // skip alread-resolved plugins
        if (!page.plugins[i].type) throw new Error("cannot resolve plugin declared without 'type' at index: "+i);
        var pluginLoader = require(pluginPath(page.plugins[i].type));
        var PluginModule = pluginLoader(Sate);
        var resolvedPlugin;
        if (PluginModule.compiler) {
            resolvedPlugin = new PluginModule.compiler(page.plugins[i], page, Sate);
        } else {
            resolvedPlugin = page.plugins[i];
        }
        if (PluginModule.renderer) {
            page['plugin-'+page.plugins[i].type] = PluginModule.renderer;
        }
        resolvedPlugin.resovled = true;
        resolvedPlugins.push(resolvedPlugin);
        if (resolvedPlugin.id) {
            resolvedPlugins[resolvedPlugin.id] = resolvedPlugin;
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
        resolvePageType(page);
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
