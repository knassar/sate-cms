function Command() {
    var fs = require('fs'),
        path = require('path');

    var cmd = {
        args: {
            encoding: 'utf-8',
            sitePath: './'
        },
        commandName: 'sate',
        help: function(command) {
            if (command) {
                try {
                    console.log(fs.readFileSync(path.join(__dirname, 'help/help-'+Sate.Command[command].commandName+'.txt'), {encoding: this.args.encoding}));
                } catch (err) {
                    this.help();
                }
            } else {
                console.log(fs.readFileSync(path.join(__dirname, 'help/help-sate.txt'), {encoding: this.args.encoding}));
            }
        },
        argFlags: {
            '-s': 'sitePath',
            '--site': 'sitePath',
            '-l': 'log',
            '--log': 'log',
        },
        captureFlags: function(args) {
            for (var i = 0; i < args.length; i++) {
                if (this.argFlags.hasOwnProperty(args[i])) {
                    if (i == args.length -1 || args[i+1].substr(0,1) == '-') {
                        this.args[this.argFlags[args[i]]] = true;
                    } else {
                        this.args[this.argFlags[args[i]]] = args[++i];
                    }
                } else {
                    switch (args[i]) {
                        case '-v':
                        case '--verbose':
                            this.args.logLevel = Sate.LogLevel.Verbose;
                            break;
                        case '-q':
                        case '--quiet':
                            this.args.logLevel = Sate.LogLevel.Quiet;
                            break;
                        case '-h':
                        case '--help': 
                            // annotation for jshint
                            /* falls through */
                        default:
                            this.help();
                            process.exit(0);
                    }
                }
            }
        }
    };
    return cmd;
}
module.exports = Command;
