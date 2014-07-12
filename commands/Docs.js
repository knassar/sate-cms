function Docs() {
    var extend = require(Sate.nodeModInstallDir+'node.extend'),
        path = require('path'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        ncp = require(Sate.nodeModInstallDir+'ncp'),
        Command = require(__dirname+'/command');
    
    var cmd = extend(true,
        (new Command()),
        {
            _super: (new Command()),
            commandName: 'docs',
            args: {
                port: 4000,
                logLevel: Sate.LogLevel.Normal,
                docsTargetPath: '/tmp/sate-cms-docs'
            },
            argFlags: {
                '-p': 'port',
                '--port': 'port',
                '-t': 'docsTargetPath',
                '--target': 'docsTargetPath'
            },
            site: null,
            docsSourcesPath: __dirname+'/../docs-source',
            captureFlags: function(args) {
                this._super.captureFlags(args);
            },
            installDocs: function(complete) {
                var s = path.join(this.docsSourcesPath),
                    d = path.join(this.args.docsTargetPath);
                ncp(s, d, {
                    filter: function(filename) {
                        return (!/\.DS\_Store/.test(filename));
                    },
                    clobber: true
                }, function() {
                    complete();
                });
            },
            installPlugins: function(complete) {
                var s = path.join(__dirname, '../sate-plugins'),
                    d = path.join(this.args.docsTargetPath, 'sate-cms/plugins');
                ncp(s, d, {
                    filter: function(filename) {
                        return (!/\.DS\_Store/.test(filename));
                    },
                    clobber: true
                }, function() {
                    complete();
                });

            },
            execute: function() {
                Sate.Log.logBox( ["Starting Sate - Docs"] );
                this.site = new Sate.Website(this.args);
                self = this;
                flow.exec(
                    function() {
                        self.installDocs(this);
                    },
                    function() {
                        self.installPlugins(this);
                    },
                    function() {
                        process.chdir(self.args.docsTargetPath);
                        self.site.compile(true, this);
                    },
                    function() {
                        Sate.Log.logAction("starting server...", 0);
                        var server = new Sate.Server.StaticServer();
                        Sate.Log.logAction("Sate documentation available at http://localhost:"+cmd.site.args.port, 1);
                    }
                );
            }
        });
    return cmd;
}

var exec = function(args) {
    var cmd = new Docs();
    cmd.captureFlags(args);
    cmd.execute();
};
exec.commandName = 'docs';
module.exports = exec;