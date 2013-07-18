#!/usr/bin/env node // makes the script executable on it's own as a cli

(function(){
    // @TODO: Real dependency management: make this into a node package!
    try {
        var fs = require('fs'),
            path = require('path'),
            extend = require('node.extend'),
            connect = require('connect'),
            Mustache = require('mustache');
    } catch (e) {
        console.error("Missing dependencies.\n Please run the following:\n    npm install node.extend connect mustache\n");
        process.exit(1);
    }
    
    var xChars = function(char, len) {
        var d = 0;
        var line = [];
        while(d < len) {
            ++d;
            line.push(char);
        }
        return line.join('');
    };
    var dash = "-";
    var minLineLen = 60;
    var logLineDashes = function(minLen) {
        if (!minLen || minLen < minLineLen) {
            minLen = minLineLen;
        }
        return xChars(dash, minLen);
    };
    var logSeparator = function() {
        console.log( " +"+logLineDashes() );
    };
    var logBox = function(lines) {
        var boxWidth = minLineLen,
            l = 0;
        for (l=0; l < lines.length; l++) {
            if (lines[l].length > boxWidth) {
                boxWidth = lines[l].length;
            }
        }
        console.log( " +"+logLineDashes(boxWidth)+"+" );
        for (l=0; l < lines.length; l++) {
            console.log(" | "+lines[l] + xChars(" ", boxWidth-lines[l].length-2) +" |");
        }
        console.log( " +"+logLineDashes(boxWidth)+"+" );
    };
    
    var startTime = new Date();
    var executionTime = function() {
        return (new Date()).getTime() - startTime.getTime();
    };

    
    var Sate = {
            Directive: {
                Develop: 'develop',
                Run: 'run',
                Analyze: 'analyze',
                Deploy: 'deploy'
            },
            PageType: require('./sate-resources/PageType'),
            IndexSort: require('./sate-resources/IndexSort'),
            Website: require('./sate-resources/Website'),
            Page: require('./sate-resources/Page'),
            MenuItem: require('./sate-resources/MenuItem'),
            Server: require('./sate-resources/Server'),
            utils: require('./sate-resources/sate-utils'),
            LogLevel: {
                Quiet: 'quiet',
                Normal: 'normal',
                Verbose: 'versose'
            }
        },
        sateApp = {
            defaults: {
                directive: Sate.Directive.Develop,
                website: './website.json',
                encoding: 'utf-8',
                content: './',
                port: 80,
                logLevel: Sate.LogLevel.Normal
            },
            directive: null,
            flags: {
                siteConfig: {}
            },
            modulePath: function(filePath) {
                return path.join(__dirname, filePath);
            },
            help: function() {
                console.log(fs.readFileSync(this.modulePath('help.txt'), {encoding: this.defaults.encoding}));
            },
            initDefaults: function() {
                this.directive = this.defaults.directive;
            },
            argFlags: {
                '-w': 'website',
                '--website': 'website',
                '-c': 'content',
                '--content': 'content',
                '-p': 'port',
                '--port': 'port',
                '-b': 'buildPath',
                '--build-path': 'buildPath',
                '-l': 'log',
                '--log': 'log',
            },
            processArgs: function(processArgv) {
                var args = processArgv.slice(2);
                if (args[0] == Sate.Directive.Develop ||
                    args[0] == Sate.Directive.Run ||
                    args[0] == Sate.Directive.Analyze ||
                    args[0] == Sate.Directive.Deploy) {

                    this.directive = args[0];
                    args.shift();
                }
                for (var i = 0; i < args.length; i++) {
                    if (this.argFlags.hasOwnProperty(args[i])) {
                        this.flags[this.argFlags[args[i]]] = args[++i];
                    } else {
                        switch (args[i]) {
                            case '--clean':
                                this.flags.cleanTargets = true;
                                break;
                            case '-v':
                            case '--verbose':
                                this.flags.logLevel = Sate.LogLevel.Verbose;
                                break;
                            case '-q':
                            case '--quiet':
                                this.flags.logLevel = Sate.LogLevel.Quiet;
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
            },
            failWith: function(err) {
                // @TODO: Richer error handling
                console.error(err);
                process.exit(1);
            },
            init: function(process) {
                this.initDefaults();
                this.processArgs(process.argv);
            },
            execute: function(process) {
                this.init(process);
                this[this.directive].apply(this);
            },

            /** directive flow actions */
            createWebsite: function() {
                var websitePath = this.defaults.website;
                if (this.flags.website) {
                    websitePath = this.flags.website;
                }
                return new Sate.Website(websitePath, this.flags, Sate);
            },
            reportAnalyze: function() {
                var site = sateApp.site;
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
            
            /** directives */
            develop: function() {
                logBox( ["Starting Sate - Develop"] );
                console.log( " +-> processing website config..." );
                this.site = sateApp.createWebsite();
                this.site.compile(function() {
                    // flow: 
                    // initialize the server:
                    console.log( " +-> starting server..." );
                    console.log( " +---> listening on port "+sateApp.site.siteConfig.port+"..." );
                    var server = new Sate.Server.DevelopmentServer(sateApp.site, Sate);
                }, this.failWith);
                //      > parse and create a Sate.Website
                //      > parse and compile requested Sate.Page
                //          > render & return Page
            },
            analyze: function() {
                logBox( ["Starting Sate - Analyze"] );
                console.log( " +-> compiling website..." );
                this.site = this.createWebsite(this.websiteConfig);
                // parse and create a Sate.Website
                //    > traverse each page:
                //        > parse and compile Sate.Page
                this.site.compile(this.reportAnalyze, this.failWith);
                // @TODO: Parse out errors from compile
            },
            run: function() {
                logBox( ["Starting Sate - Run"] );
                console.log( " +-> processing website config..." );
                this.site = sateApp.createWebsite();
                this.site.compile(function() {
                    // flow: 
                    // initialize the server:
                    console.log( " +-> starting server..." );
                    console.log( " +---> listening on port "+sateApp.site.siteConfig.port+"..." );
                    var server = new Sate.Server.ProductionServer(sateApp.site, Sate);
                }, this.failWith);
            },
            deploy: function() {
                console.log( "DEPLOY" );
                // flow: 
                // parse and create a Sate.Website
                //    > traverse each page:
                //        > parse and compile Sate.Page
                //            > render & output Page
            }
        };
        
    sateApp.execute(process);

})();