function Develop(Sate) {
    var extend = require(Sate.nodeModInstallDir+'node.extend'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        Command = require(__dirname+'/command');
    
    var cmd = extend(true,
        (new Command(Sate)),
        {
            _super: (new Command(Sate)),
            commandName: 'develop',
            args: {
                port: 3000,
                logLevel: Sate.LogLevel.Normal
            },
            argFlags: {
                '-p': 'port',
                '--port': 'port'
            },
            site: null,
            execute: function() {
                Sate.Log.logBox( ["Starting Sate - Develop"] );
                this.site = new Sate.Website(this.args, Sate);
                self = this;
                flow.exec(
                    function() {
                        self.site.compile(true, this);
                    },
                    function() {
                        Sate.Log.logAction("starting server...", 0);
                        var server = new Sate.Server.DevelopmentServer(self.site, Sate);
                        Sate.Log.logAction("listening on port "+cmd.site.args.port+"...", 1);
                    }
                );
            }
        });
    return cmd;
}

var exec = function(args, Sate) {
    var cmd = new Develop(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};
exec.commandName = 'develop';
module.exports = exec;