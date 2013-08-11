function Docs(Sate) {
    var extend = require('node.extend'),
        flow = require('flow'),
        Command = require(__dirname+'/command');
    
    var cmd = extend(true,
        (new Command()),
        {
            _super: (new Command()),
            args: {
                port: 4000,
                logLevel: Sate.LogLevel.Normal
            },
            argFlags: {
                '-p': 'port',
                '--port': 'port'
            },
            site: null,
            captureFlags: function(args) {
                this._super.captureFlags(args);
                // @TODO: point at ./docs for the deployed docs instead!
                this.args.sitePath = './docs-source';
            },
            execute: function() {
                Sate.Log.logBox( ["Starting Sate - Docs"] );
                this.site = new Sate.Website(this.args, Sate);
                self = this;
                flow.exec(
                    function() {
                        self.site.compile(true, this);
                    },
                    function() {
                        Sate.Log.logAction("starting server...", 0);
                        var server = new Sate.Server.DevelopmentServer(self.site, Sate);
                        Sate.Log.logAction("Sate documentation available at http://localhost:"+cmd.site.args.port, 1);
                    }
                );
            }
        });
    return cmd;
}

module.exports = function(args, Sate) {
    var cmd = new Docs(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};
