function Docs(Sate) {
    var extend = require('node.extend'),
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
                console.log( " +-> processing website config..." );
                this.site = new Sate.Website(this.args, Sate);
                this.site.compile(function() {
                    console.log( " +-> starting server..." );
                    var server = new Sate.Server.ProductionServer(cmd.site, Sate);
                    console.log( " +---> Sate documentation available at http://localhost:"+cmd.site.args.port );
                }, this.failWith);
            }
        });
    return cmd;
}

module.exports = function(args, Sate) {
    var cmd = new Docs(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};