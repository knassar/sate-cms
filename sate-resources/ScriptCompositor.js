function ScriptCompositor() {
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        PagePluginsResolver = require(__dirname+'/PagePluginsResolver'),
        pluginsResolver = new PagePluginsResolver();
            
    var compositor = {
        pluginScripts: [],
        execute: function(sitePath, targetPath, complete) {
            var self = this;
            var enc = {encoding: Sate.currentSite.config.encoding};
            var lines;
            flow.exec(
                function() {
                    pluginsResolver.allInstalledPlugins(this);
                },
                function(plugins) {
                    plugins.forEach(function(plugin) {
                        if (plugin.scripts && plugin.scripts.length > 0) {
                            var pluginPath = pluginsResolver.resourcesDirForPlugin(plugin);
                            self.pluginScripts.push('/** '+plugin.type+' **/');
                            plugin.scripts.forEach(function(script) {
                                self.pluginScripts.push('/** '+script+' **/;');
                                var js = fs.readFileSync(path.join(pluginPath, script), enc);
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