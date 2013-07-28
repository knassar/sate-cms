function Run(Sate) {
    var extend = require('node.extend'),
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
                console.log( " +-> processing website config..." );
                this.site = new Sate.Website(this.args, Sate);
                this.site.compile(function() {
                    console.log( " +-> starting server..." );
                    var server = new Sate.Server.ProductionServer(cmd.site, Sate);
                    console.log( " +---> listening on port "+cmd.site.args.port+"..." );
                }, this.failWith);
            }
        });
    return cmd;
}


module.exports = function(args, Sate) {
    var cmd = new Run(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};
