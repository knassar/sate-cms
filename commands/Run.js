function Run() {
    var extend = require(Sate.nodeModInstallDir+'node.extend'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        Command = require(__dirname+'/command');
    
    var cmd = extend(true,
        (new Command()),
        {
            _super: (new Command()),
            commandName: 'run',
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
                Sate.Log.startBox( ["Starting Sate - Run"] );
                this.site = new Sate.Website(this.args);
                self = this;
                flow.exec(
                    function() {
                        self.site.compile(this);
                    },
                    function() {
                        Sate.Log.logAction("starting server...", 0);
                        var server = new Sate.Server.StaticServer();
                        Sate.Log.logSuccess("listening on port "+cmd.site.args.port+"...");
                    }
                );
            }
        });
    return cmd;
}


var exec = function(args) {
    var cmd = new Run();
    cmd.captureFlags(args);
    cmd.execute();
};
exec.commandName = 'run';
module.exports = exec;