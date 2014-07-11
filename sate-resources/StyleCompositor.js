function StyleCompositor() {
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        PagePluginsResolver = require(__dirname+'/PagePluginsResolver'),
        pluginsResolver = new PagePluginsResolver();
    
    var cssMatcher = /\.css$/mi;
    var importMatcher = /^\s*@import\s+url\(['"]?([^'"]+)['"]?\);?/gmi;
        
    var d = 0;
    var inlineImports = function(compositor, filepath, filename) {
        var thisFilePath = path.join(filepath, filename);
        var css = " \n" + fs.readFileSync(thisFilePath, compositor.enc);

        var lines = css.split('\n');
        var inlined = [];
        lines.forEach(function(line) {
            var imp = importMatcher.exec(line);
            if (imp && imp.length > 1) {
                inlined.push('\n/** '+ imp[0] +' **/');
                var subInline = inlineImports(compositor, filepath, imp[1]);
                inlined.push(subInline);
            }
            else {
                inlined.push(line);
            }
        });
        
        var inlinedCss = inlined.join('\n');
        fs.writeFileSync(thisFilePath, inlinedCss, compositor.enc);
        return inlinedCss;
    };
    
    var traverseStylesAndInlineImports = function(compositor, dir) {
        var files = fs.readdirSync(dir);

        files.forEach(function(file) {
            var filePath = path.join(dir, file);
            var stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                traverseStylesAndInlineImports(compositor, filePath);
            }
            else if (stat.isFile() && cssMatcher.test(file)) {
                inlineImports(compositor, dir, file);
            }
        });
    };
    
    var compositor = {
        composedStyles: [],
        composed: function(url) {
            this.composedStyles.push(url);
        },
        pluginStylesheets: [],
        isComposed: function(url) {
            return this.composedStyles.indexOf(url) > -1;
        },
        encoding: {},
        execute: function(sitePath, targetPath, complete) {
            var self = this;
            self.enc = {encoding: Sate.currentSite.config.encoding};
            var lines;
            flow.exec(
                function() {
                    Sate.Log.logAction("Inlining Stylesheet @imports", 1);
                    traverseStylesAndInlineImports(self, path.join(targetPath, 'styles'));
                    this.apply();
                },
                function() {
                    Sate.Log.logAction("Compiling Sate Plugin Stylesheets", 1);
                    pluginsResolver.allInstalledPlugins(this);
                },
                function(plugins) {
                    plugins.forEach(function(plugin) {
                        if (plugin.stylesheets && plugin.stylesheets.length > 0) {
                            var pluginPath = pluginsResolver.resourcesDirForPlugin(plugin);
                            self.pluginStylesheets.push('/** '+plugin.type+' **/');
                            plugin.stylesheets.forEach(function(style) {
                                self.pluginStylesheets.push('/** '+style+' **/');
                                var css = fs.readFileSync(path.join(pluginPath, style), self.enc);
                                self.pluginStylesheets.push(css);
                            });
                        }
                    });
                    this.apply();
                },
                function() {
                    var pluginStyleSheet = self.pluginStylesheets.join('\n');
                    fs.writeFile(path.join(targetPath, PagePluginsResolver.deployPluginStyleSheetURL), pluginStyleSheet, self.enc, this);
                },
                function() {
                    complete.apply();
                }
            );
        }
    };
    
    return compositor;
}


module.exports = StyleCompositor;