function Update(Sate) {

    var fs = require('fs'),
        path = require('path'),
        extend = require(Sate.nodeModInstallDir+'node.extend'),
        ncp = require(Sate.nodeModInstallDir+'ncp'),
        Command = require(__dirname+'/command');

    var isAbstractPluginClass = function(pluginName) {
        return (/Plugin\.js$/).test(pluginName);
    };

    var versionForPlugin = function(pluginPath) {
        var pluginClass;
        if (isAbstractPluginClass(pluginPath)) {
            pluginClass = require(fs.realpathSync(pluginPath));
        } else {
            pluginClass = require(fs.realpathSync(path.join(pluginPath, 'plugin.js')));
        }
        return (new pluginClass(Sate, {})).version;
    };

    var pluginVersions = function(pluginsPath) {
        var pluginFiles = fs.readdirSync(fs.realpathSync(pluginsPath));
        var plugins = {};
        for (var i=0; i < pluginFiles.length; i++) {
            if (!/\.DS\_Store/.test(pluginFiles[i])) {
                plugins[pluginFiles[i]] = versionForPlugin(path.join(pluginsPath, pluginFiles[i]));
            }
        }
        return plugins;
    };
    
    var isABeforeB = function(a, b) {
        if (!a || !b) return true;
        a = a.split('.');
        b = b.split('.');
        for (var i=0; i < a.length; i++) {
            if (a[i] < b[i]) {
                return true;
            }
        }
        return false;
    };
    
    var cmd = extend(true,
        (new Command(Sate)),
        {
            _super: (new Command(Sate)),
            args: {
                force: false,
                addMissing: false
            },
            argFlags: {
                '-a': 'addMissing',
                '--add-missing': 'addMissing',
                '-f': 'force',
                '--force': 'force'
            },
            copyPlugin: function(pluginName, onComplete) {
                var s = path.join(__dirname, '../sate-plugins', pluginName),
                    d = path.join(this.args.sitePath, 'sate-cms/plugins', pluginName);
                ncp(s, d, {
                    filter: function(filename) {
                        return (!/\.DS\_Store/.test(filename));
                    },
                    clobber: true
                }, function() {
                    onComplete(pluginName);
                });

            },
            updatePlugin: function(pluginName, onComplete) {
                console.log( " +---> updating "+pluginName );
                this.copyPlugin(pluginName, onComplete);
            },
            installPlugin: function(pluginName, onComplete) {
                console.log( " +---> installing "+pluginName );
                this.copyPlugin(pluginName, onComplete);
            },
            ensurePluginsUpToDate: function(done) {
                console.log( " +--> plugins");
                var sitePlugins = pluginVersions(path.join(this.args.sitePath, 'sate-cms/plugins')),
                    sourcePlugins = pluginVersions(path.join(__dirname, '../sate-plugins')),
                    copyPlugins = {};
                    
                var perComplete = function(name) {
                    if (copyPlugins.hasOwnProperty(name)) {
                        copyPlugins[name] = true;
                    }
                    for (var p in copyPlugins) {
                        if (copyPlugins.hasOwnProperty(p) && !copyPlugins[p]) {
                            return;
                        }
                    }
                    done();
                };
                for (var p in sitePlugins) {
                    if (sitePlugins.hasOwnProperty(p) && sourcePlugins.hasOwnProperty(p) && (this.args.force || isABeforeB(sitePlugins[p], sourcePlugins[p]))) {
                        copyPlugins[p] = false;
                    }
                }
                if (this.args.addMissing) {
                    for (var sp in sourcePlugins) {
                        if (sourcePlugins.hasOwnProperty(sp) && !sitePlugins.hasOwnProperty(sp)) {
                            copyPlugins[sp] = false;
                        }
                    }
                }
                for (var cp in copyPlugins) {
                    if (copyPlugins.hasOwnProperty(cp)) {
                        if (sitePlugins.hasOwnProperty(cp)) {
                            this.updatePlugin(cp, perComplete);
                        } else {
                            this.installPlugin(cp, perComplete);
                        }
                    }
                }
                if (copyPlugins.length === 0) {
                    done();
                }
            },
            execute: function() {
                Sate.Log.logBox( ["Updating Sate Site"] );
                console.log( " +-> checking website sources..." );
                this.ensurePluginsUpToDate(function() {
                    Sate.Log.logBox( ["Update Done"] );
                    process.exit(0);
                });
            }
        });
    return cmd;
}

module.exports = function(args, Sate) {
    var cmd = new Update(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};
