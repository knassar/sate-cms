function Run(Sate) {
    var extend = require('node.extend'),
        flow = require('flow'),
        Command = require(__dirname+'/command');
    
    var cmd = extend(true,
        (new Command(Sate)),
        {
            _super: (new Command(Sate)),
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
                Sate.Log.logBox( ["Starting Sate - Run"] );
                this.site = new Sate.Website(this.args, Sate);
                self = this;
                flow.exec(
                    function() {
                        self.site.compile(true, this);
                    },
                    function() {
                        Sate.Log.logAction("starting server...", 0);
                        var server = new Sate.Server.ProductionServer(cmd.site, Sate);
                        Sate.Log.logAction("listening on port "+cmd.site.args.port+"...", 1);
                    }
                );
            }
        });
    return cmd;
}


module.exports = function(args, Sate) {
    var cmd = new Run(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};
