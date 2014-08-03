function StyleCompositor() {
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        less = require('less'),
        PagePluginsResolver = require(__dirname+'/PagePluginsResolver'),
        pluginsResolver = new PagePluginsResolver();
    
    var cssMatcher = /\.css$/mi;
    var lessMatcher = /\.less$/mi;
    
    var inlineImports = function(compositor, filepath, filename) {
        var inlinedCss;
        if (cssMatcher.test(filename)) {
            Sate.Log.logAction("'"+filename+"'", 2);
            var thisFilePath = path.join(filepath, filename);
            var css = " \n" + fs.readFileSync(thisFilePath, compositor.enc);

            var inlinedCss = "";

            var match = null;
            var importMatcher = /@import\s*(?:url)?\(?\s*['"]?([\/-\w\.]+)['"]?\)?;?/gi;
            var lastIndex = 0;
            
            while ((match = importMatcher.exec(css)) !== null) {
                if (match.length > 1) {
                    inlinedCss += css.substring(lastIndex, match.index);
                    lastIndex = importMatcher.lastIndex;
                    
                    inlinedCss += '\n/** '+ match[0] +' **/\n';
                    var subInline = inlineImports(compositor, filepath, match[1]);
                    inlinedCss += subInline + '\n';
                }
            }

            inlinedCss += css.substring(lastIndex);

            fs.writeFileSync(thisFilePath, inlinedCss, compositor.enc);
        }
        return inlinedCss;
    };
    
    var compileLessSourceToCSS = function(lessSourcePath, minify, complete) {
        var importPath = lessSourcePath.split('/').slice(0, -1).join('/');
        var parser = new(less.Parser)({
            paths: [importPath],
            filename: lessSourcePath
        });
        
        fs.readFile(lessSourcePath, {encoding: Sate.currentSite.config.encoding}, function(err, data) {
            if (err) {
                Sate.Log.logError("couldn't find LESS file '"+lessSourcePath+"'", 2);
                complete("");
                return;
            }
            try {
                parser.parse(data, function (err, tree) {
                    if (err) {
                        throw Error(err);
                    }

                    var css = tree.toCSS({
                        compress: minify
                    });

                    complete(css);
                });
            }
            catch (e) {
                Sate.Log.logError("LESS couldn't parse '"+lessSourcePath+"'", 2, e);
                complete(data);
            }
        });
    };
    
    var compileLess = function(compositor, filepath, filename) {
        if (lessMatcher.test(filename)) {
            traversalCounter++;
            Sate.Log.logAction("'"+filename+"'", 2);
            compileLessSourceToCSS(path.join(filepath, filename), true, function(css) {
                if (css) {
                    fs.writeFileSync(path.join(filepath, filename.replace(lessMatcher, '.css')), css, compositor.enc);
                }
                traversalCounter--;

                setTimeout(traversalCheck, 10);
            });
        }
    };

    var traversalCounter = -1;
    var traversalCheck = function() {
        if (traversalComplete != null && traversalCounter === 0) {
            traversalComplete.apply();
            traversalComplete = null;
        }
    };
    var traversalComplete = null;
    var traverseStylesAndApply = function(compositor, dir, operation, complete) {
        if (traversalCounter == -1) {
            traversalCounter = 0;
        }
        
        if (complete) {
            traversalComplete = complete;
        }
        
        var files = fs.readdirSync(dir);

        files.forEach(function(file) {
            var filePath = path.join(dir, file);
            var stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                traverseStylesAndApply(compositor, filePath, operation);
            }
            else if (stat.isFile()) {
                operation.apply(this, [compositor, dir, file]);
            }
        });
        
        traversalComplete();
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
                    Sate.Log.logAction("Compiling LESS Stylesheets", 1);
                    traverseStylesAndApply(self, path.join(targetPath, 'styles'), compileLess, this);
                },
                function() {
                    // HACK HACK HACK
                    setTimeout(this, 200);
                },
                function() {
                    Sate.Log.logAction("Inlining Stylesheet @imports", 1);
                    traverseStylesAndApply(self, path.join(targetPath, 'styles'), inlineImports, this);
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
        },
        compileLess: function(lessSourcePath, minify, complete) {
            compileLessSourceToCSS(lessSourcePath, minify, complete);
        }
    };
    
    return compositor;
}


module.exports = StyleCompositor;