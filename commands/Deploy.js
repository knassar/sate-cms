function Deploy(Sate) {
    var extend = require(Sate.nodeModInstallDir+'node.extend'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        fs = require('fs'),
        path = require('path'),
        ncp = require(Sate.nodeModInstallDir+'ncp'),
        Command = require(__dirname+'/command');
    
    var cleanDir = function(target) {
        var contents = fs.readdirSync(target);
        for (var i = 0; i < contents.length; i++) {
            var nextPath = target + "/" + contents[i];
            var stats = fs.statSync(nextPath);
            if (stats.isDirectory()) {
                cleanDir(nextPath);
                fs.rmdirSync(nextPath);
            } else {
                fs.unlinkSync(nextPath);
            }
        }
    };

    var ensurePageDirectory = function (filePath, complete) {
        var pageDir = filePath.replace(/index.html$/, '');
        fs.mkdir(pageDir, complete);
    };

    var cmd = extend(true,
        (new Command(Sate)),
        {
            _super: (new Command(Sate)),
            args: {
                targetPath: false,
                overwrite: false,
                clean: false
            },
            argFlags: {
                '-t': 'targetPath',
                '--target': 'targetPath',
                '-o': 'overwrite',
                '--overwrite': 'overwrite',
                '--clean': 'clean'
            },
            site: null,
            targetPagePaths: {},
            execute: function() {
                Sate.Log.logBox( ["Starting Sate - Deploy"] );
                this.site = new Sate.Website(this.args, Sate);                
                self = this;
                flow.exec(
                    function() {
                        self.site.parseJSON(true, this);
                    },
                    function() {
                        var buildLbl = self.site.config.buildDirName;
                        if (!buildLbl) {
                            buildLbl = self.args.sitePath.split('/').pop();
                        }
                        if (!buildLbl) {
                            buildLbl = self.site.pageDefualts.title.replace(/\s/g, '-');
                        }
                        if (self.args.targetPath === false) {
                            self.args.targetPath = ['../sate-build', buildLbl].join('-');
                        }

                        fs.readdir(self.args.targetPath, this);
                    },
                    function(err, targetFiles) {
                        if (!err && targetFiles.length > 0 && !self.args.overwrite) {
                            if (self.args.clean) {
                                cleanDir(self.args.targetPath);
                            } else {
                                Sate.Log.logError("Target directory not empty. Use --clean to overwrite.", 0);
                                process.exit(1);
                            }
                        }
                        this.apply();
                    },
                    function(err) {
                        self.site.compile(true, this);
                    },
                    function() {
                        Sate.Log.logAction("Copying static files and directories", 0);
                        ncp(self.args.sitePath,
                            self.args.targetPath,
                            {
                                clobber: self.args.overwrite,
                                filter: function(filename) {
                                    return (
                                        !(/sate\-cms$/).test(filename) && 
                                        !(/website\.json$/).test(filename) && 
                                        !(/\.html$/).test(filename)
                                        );
                                }
                            },
                            this);
                    },
                    function() {
                        for (var url in self.site.pageByPath) {
                            if (self.site.pageByPath.hasOwnProperty(url)) {
                                var page = self.site.pageByPath[url];
                                self.targetPagePaths[url] = path.join(self.args.targetPath, page.url, 'index.html');
                                ensurePageDirectory(self.targetPagePaths[url], this.MULTI('makedir '+url));
                            }
                        }
                    },
                    function() {
                        Sate.Log.logAction("Generating pages", 0);
                        for (var url in self.site.pageByPath) {
                            if (self.site.pageByPath.hasOwnProperty(url)) {
                                Sate.Log.logAction(path.join(url,'index.html'), 1);
                                var page = self.site.pageByPath[url];
                                var target = self.targetPagePaths[url];
                                var html = page.render();
                                fs.writeFile(target, html, {encoding: self.site.config.encoding}, this.MULTI(url));
                            }
                        }
                    },
                    function() {
                        Sate.Log.logBox(["Deploy complete", "Generated website at: "+fs.realpathSync(self.args.targetPath)]);
                    }
                );
            }
        });
    return cmd;
}


module.exports = function(args, Sate) {
    var cmd = new Deploy(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};
