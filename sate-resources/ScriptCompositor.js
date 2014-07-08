function ScriptCompositor(Sate) {
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        PagePluginsResolver = require(__dirname+'/PagePluginsResolver'),
        pluginsResolver = new PagePluginsResolver(Sate);
            
    var compositor = {
        pluginScripts: [],
        execute: function(website, sitePath, targetPath, complete) {
            var self = this;
            var enc = {encoding: website.config.encoding};
            var lines;
            flow.exec(
                function() {
                    pluginsResolver.allInstalledPlugins(website, this);
                },
                function(plugins) {
                    plugins.forEach(function(plugin) {
                        if (plugin.scripts && plugin.scripts.length > 0) {
                            self.pluginScripts.push('/** '+plugin.type+' **/');
                            plugin.scripts.forEach(function(script) {
                                self.pluginScripts.push('/** '+script+' **/;');
                                var js = fs.readFileSync(path.join(sitePath, script), enc);
                                self.pluginScripts.push(js);
                            });
                        }
                    });
                    this.apply();
                },
                function() {
                    var pluginScripts = self.pluginScripts.join('\n');
                    fs.writeFile(path.join(targetPath, PagePluginsResolver.deployPluginScriptURL), pluginScripts, enc, this);
                },
                function() {
                    complete.apply();
                }
            );
        }
    };
    
    return compositor;
}


module.exports = ScriptCompositor;