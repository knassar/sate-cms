function Create() {
    var extend = require(Sate.nodeModInstallDir+'node.extend'),
        fs = require('fs'),
        path = require('path'),
        ncp = require(Sate.nodeModInstallDir+'ncp'),
        exec = require('child_process').exec,
        Mustache = require(Sate.nodeModInstallDir+'mustache'),
        Command = require(__dirname+'/command');

    var verifyEmpty = function(filepath) {
        try {
            return (fs.readdirSync(filepath).length === 0);
        }
        catch (e) {
            return true;
        }
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
                clean: false,
                contentFormat: 'html'
            },
            argFlags: {
                '--html': 'html',
                '--md': 'md',
                '--markdown': 'md',
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
                            case '--html':
                                this.args.contentFormat = 'html';
                                break;
                            case '--md':
                            case '--markdown':
                                this.args.contentFormat = 'md';
                                break;
                            default:
                                this.help();
                                process.exit(0);
                        }
                    }
                }
            },
            copySitePrototype: function(complete) {
                var target = this.args.createTarget;
                var contentFormat = this.args.contentFormat;
                var self = this;
                ncp(path.join(__dirname, '../sate-site-proto'), target, {
                    filter: function(filename) {
                        return (!/\.DS\_Store/.test(filename));
                    },
                    clobber: false
                }, function(err) {
                    if (!err) {
                        switch (contentFormat) {
                        case 'html':
                            cleanTarget(path.join(target, 'content.md'));
                            fs.renameSync(path.join(target, 'content.html'), path.join(target, 'content'));
                            break;
                            
                        case 'md':
                            cleanTarget(path.join(target, 'content.html'));
                            fs.renameSync(path.join(target, 'content.md'), path.join(target, 'content'));                            
                            break;
                        }
                        
                        self.templateGenWebsiteJSON();
                        
                        ncp(path.join(__dirname, '../sate-plugins'), path.join(target, 'sate-cms/plugins'), complete);
                    } else {
                        console.log( " X-> ", err );
                    }
                });
            },
            templateGenWebsiteJSON: function() {
                var target = this.args.createTarget,
                    targetName = target.split('/').reverse()[0],
                    jsonFilename = path.join(target, 'website.json'),
                    opts = {encoding: 'utf-8'};
                
                var jsonTemplate = fs.readFileSync(jsonFilename, opts);
                var json = Mustache.render(jsonTemplate, {
                    buildDirName: targetName,
                    siteTitle: Sate.utils.pageNameFromFileName(targetName)
                });
                fs.writeFileSync(jsonFilename, json, opts);
            },
            execute: function() {
                Sate.Log.startBox( ["Creating a Sate site"] );
                var target = this.args.createTarget;
                console.log(" +-> verifying target directory: "+target );
                Sate.utils.ensurePath(target);
                if (!verifyEmpty(target)) {
                    if (this.args.clean) {
                        cleanTarget(target);
                        Sate.utils.ensurePath(target);
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
                        Sate.Log.successBox(["Done", "run: ", "    cd "+target+"; sate develop", "to load your site"]);
                    }
                });
            }
        });
    return cmd;
}


var exec = function(args) {
    var cmd = new Create(Sate);
    cmd.captureFlags(args);
    cmd.execute();
};
exec.commandName = 'create';
module.exports = exec;