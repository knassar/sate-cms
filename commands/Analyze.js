function Analyze() {
    var extend = require(Sate.nodeModInstallDir+'node.extend'),
        flow = require(Sate.nodeModInstallDir+'flow'),
        Command = require(__dirname+'/command');
    
    var cmd = extend(true,
        (new Command()),
        {
            _super: (new Command()),
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
                });
                console.log( " |    " + numPages + " pages" );
                logBox(["Done",
                        "Time: "+ runTime + 'ms']);
                console.log("\n");
            },
            execute: function() {
                Sate.Log.startBox( ["Starting Sate - Analyze"] );
                console.log( " +-> processing website config..." );
                this.site = new Sate.Website(this.args);
                // @TODO: Analyze This
                self = this;
                flow.exec(
                    function() {
                        self.site.compile(this);
                    },
                    function() {
                        Sate.Log.logAction("This is where analysis would be if it was working", 1);
                    }
                );
            }
        });
    return cmd;
}
var exec = function(args) {
    var cmd = new Analyze();
    cmd.captureFlags(args);
    cmd.execute();
};
exec.commandName = 'analyze';
module.exports = exec;