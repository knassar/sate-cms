function Deploy() {
    var extend = require(Sate.nodeModInstallDir+'node.extend'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        fs = require('fs'),
        path = require('path'),
        ncp = require(Sate.nodeModInstallDir+'ncp'),
        StyleCompositor = require(__dirname+'/../sate-resources/StyleCompositor.js'),
        styleCompositor = new StyleCompositor(),
        ScriptCompositor = require(__dirname+'/../sate-resources/ScriptCompositor.js'),
        scriptCompositor = new ScriptCompositor(),
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
        (new Command()),
        {
            _super: (new Command()),
            commandName: 'deploy',
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
                Sate.Log.startBox( ["Starting Sate - Deploy"] );
                this.site = new Sate.Website(this.args);
                self = this;
                flow.exec(
                    function() {
                        self.site.parseJSON(this);
                    },
                    function() {
                        var buildLbl = self.site.config.buildDirName;
                        if (!buildLbl) {
                            buildLbl = 'sate-build-'+self.args.sitePath.split('/').pop();
                        }
                        if (!buildLbl) {
                            buildLbl = 'sate-build-'+self.site.pageDefualts.title.replace(/\s/g, '-');
                        }
                        if (self.args.targetPath === false) {
                            self.args.targetPath = '../' + buildLbl;
                        }

                        fs.readdir(self.args.targetPath, this);
                    },
                    function(err, targetFiles) {
						if (err) {
							Sate.utils.ensurePath(self.args.targetPath);
						}
						
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
                    function() {
                        self.site.compile(this);
                    },
                    function() {
						var next = this;
						// temporary hack because of a race condition when using this.MULTI()
                        setTimeout(function() {
							next.apply();
						}, 200);
                    },
                    function() {
                        var sourcePathMask = fs.realpathSync(self.args.sitePath);

                        Sate.Log.logAction("Copying static files and directories", 0);
                        ncp(self.args.sitePath,
                            self.args.targetPath,
                            {
                                clobber: self.args.overwrite,
                                filter: function(filename) {
                                    var filename = filename.replace(sourcePathMask, '');
                                    var incl = (
                                        filename == '' ||
                                        (/\.ico$/mi).test(filename)||
                                        (/^\/styles\/?.*/mi).test(filename)||
                                        (/^\/scripts\/?.*/mi).test(filename)||
                                        (/^\/images\/?.*/mi).test(filename)||
                                        (/^\/sate-gallery-thumbs\/?.*/mi).test(filename)
                                    );
                                    return incl;
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
                        Sate.Log.logAction("Generating Error pages", 0);
                        for (var error in self.site.errorPages) {
                            if (self.site.errorPages.hasOwnProperty(error)) {
                                var url = error + '.html';
                                Sate.Log.logAction(url, 1);
                                var page = self.site.errorPages[error];
                                var target = path.join(self.args.targetPath, url);
                                var html = page.render();
                                fs.writeFile(target, html, {encoding: self.site.config.encoding}, this.MULTI(url));
                            }
                        }
                    },
                    function() {
                        Sate.Log.logAction("Writing Apache config", 0);
                        var htaccess = [];
                        for (var error in self.site.errorPages) {
                            if (self.site.errorPages.hasOwnProperty(error)) {
                                var code = error.replace('error', '');
                                htaccess.push('ErrorDocument '+code+'     /'+error+'.html');
                            }
                        }
                        var target = path.join(self.args.targetPath, '.htaccess');
                        fs.writeFile(target, htaccess.join('\n'), {encoding: self.site.config.encoding}, this);
                    },
                    function() {
                        Sate.Log.logAction("Compiling Stylesheets", 0);
                        styleCompositor.execute(self.args.sitePath, self.args.targetPath, this);
                    },
                    function() {
                        Sate.Log.logAction("Compiling Sate Plugin Scripts", 0);
                        scriptCompositor.execute(self.args.sitePath, self.args.targetPath, this);
                    },
                    function() {
                        Sate.Log.successBox(["Deploy complete", "Generated website at: "+fs.realpathSync(self.args.targetPath)]);
                    }
                );
            }
        });
    return cmd;
}


var exec = function(args) {
    var cmd = new Deploy();
    cmd.captureFlags(args);
    cmd.execute();
};
exec.commandName = 'deploy';
module.exports = exec;