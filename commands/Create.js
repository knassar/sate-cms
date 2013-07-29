function Create(Sate) {
    var extend = require('node.extend'),
        fs = require('fs'),
        path = require('path'),
        ncp = require('ncp'),
        exec = require('child_process').exec,
        Command = require(__dirname+'/command');

    var ensurePath = function(filepath) {
        var pathParts = filepath.split('/');
        var check = fs.realpathSync(pathParts.shift());
        while (pathParts.length > 0) {
            check = path.join(check, pathParts.shift());
            if (!fs.existsSync(check)) {
                fs.mkdirSync(check);
            }
        }
    };
    var verifyEmpty = function(filepath) {
        return (fs.readdirSync(filepath).length === 0);
    };
    var cleanTarget = function(filepath) {
        var filesInTarget = fs.readdirSync(filepath);
        for (var i=0; i < filesInTarget.length; i++) {
            var file = path.join(filepath, filesInTarget[i]);
            var stats = fs.statSync(file);
            if (stats.isFile()) {
                fs.unlinkSync(file);
            } else if (stats.isDirectory()) {
                cleanTarget(file);
            }
        }
        fs.rmdirSync(filepath);
    };
    
    var cmd = extend(true,
        (new Command(Sate)),
        {
            _super: (new Command(Sate)),
            args: {
                createTarget: './',
                clean: false
            },
            argFlags: {
                '--clean': 'clean'
            },
            captureFlags: function(args) {
                for (var i = 0; i < args.length; i++) {
                    if (i === 0 && args[i].substr(0,1) != '-' && !this.argFlags.hasOwnProperty(args[i])) {
                        this.args.createTarget = args[i];
                    } else {
                        switch (args[i]) {
                            case '--clean':
                                this.args.clean = true;
                                break;
                            default:
                                this.help();
                                process.exit(0);
                        }
                    }
                }
            },
            copySitePrototype: function(complete) {
                ncp(path.join(__dirname, '../sate-site-proto'), this.args.createTarget, {
                    filter: function(filename) {
                        return (!/\.DS\_Store/.test(filename));
                    },
                    clobber: false
                }, complete);
            },
            execute: function() {
                Sate.Log.logBox( ["Creating a Sate site"] );
                var target = this.args.createTarget;
                console.log(" +-> verifying target directory: "+target );
                ensurePath(target);
                if (!verifyEmpty(target)) {
                    if (this.args.clean) {
                        cleanTarget(target);
                        ensurePath(target);
                    } else {
                        console.error(" X-> target directory is not empty! Choose another target or use --clean to overwrite.");
                        process.exit(1);
                    }
                }
                console.log(" +-> copying sate resources");
                this.copySitePrototype(function(err) {
                    if (err) {
                        console.log( err );
                    } else {
                        Sate.Log.logBox(["Done", "run: ", "    cd "+target+"; sate-cms develop", "to load your site"]);
                    }
                });
            }
        });
    return cmd;
}


module.exports = function(args, Sate) {
    var cmd = new Create(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};
