function Analyze(Sate) {
    var extend = require('node.extend'),
        Command = require(__dirname+'/command');
    
    var cmd = extend(true,
        (new Command(Sate)),
        {
            _super: (new Command(Sate)),
            site: null,
            reportAnalyze: function() {
                var site = sateCMS.site;
                var runTime = executionTime();
                console.log( " | compile complete." );
                console.log( " |");
                console.log( " | Website Statistics:" );

                var numPages = 0;
                site.eachPage(function() {
                    numPages++;
                }, true);
                console.log( " |    " + numPages + " pages" );
                logBox(["Done",
                        "Time: "+ runTime + 'ms']);
                console.log("\n");
            },
            execute: function() {
                Sate.Log.logBox( ["Starting Sate - Analyze"] );
                console.log( " +-> processing website config..." );
                this.site = new Sate.Website(this.args, Sate);
                // @TODO: Analyze This
                this.site.compile(function() {
                    console.log( " +---> This is where analysis would be if it was working" );
                }, this.failWith);
            }
        });
    return cmd;
}
module.exports = function(args, Sate) {
    var cmd = new Analyze(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};