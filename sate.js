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
        
        
    var Sate = {
            Directive: {
                Develop: 'develop',
                Run: 'run',
                Analyze: 'analyze',
                Deploy: 'deploy'
            },
            PageType: require('./server/PageType'),
            IndexSort: require('./server/IndexSort'),
            Website: require('./server/Website'),
            Page: require('./server/Page'),
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
            flags: {},
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
                            default:
                                this.help();
                                process.exit(0);
                        }
                    }
                }
            },
            failWith: function(err) {
                throw err;
                console.error(err);
                process.exit(1);
            },
            init: function(process) {
                this.initDefaults();
                this.processArgs(process.argv);
            },
            execute: function(process) {
                this.init(process);
                this.loadWebsiteJSON();
            },
            loadWebsiteJSON: function() {
                var websitePath = this.defaults.website;
                if (this.flags.website) {
                    websitePath = this.flags.website;
                }
                websitePath = path.normalize(websitePath);
                fs.readFile(websitePath, {encoding: this.defaults.encoding}, function(err, data) {
                    sateApp.parseWebsiteJSON(err, data)
                });
            },
            parseWebsiteJSON: function(err, data) {
                if (err) {
                    this.failWith(err);
                } else {
                    try {
                        var siteData = JSON.parse(data);
                        this.websiteConfig = extend(true,
                            this.defaults, 
                            siteData, 
                            {
                                siteConfig: this.flags
                            }
                        );
                        this.executeDirective();
                    } catch (err) {
                        this.failWith(err);
                    }
                }
            },
            executeDirective: function() {
                this[this.directive].apply(this);
            },

            /** directive flow actions */
            createWebsite: function(websiteConfig) {
                return new Sate.Website(websiteConfig, Sate);
            },
            reportAnalyze: function() {
                console.log( sateApp.site );
                console.log( "DONE ANALYZE" );
            },
            
            /** directives */
            develop: function() {
                console.log( "DEVELOP" );
                // flow: 
                // initialize the server:
                //      > parse and create a Sate.Website
                //      > parse and compile requested Sate.Page
                //          > render & return Page
            },
            analyze: function() {
                console.log( "ANALYZE" );
                this.site = this.createWebsite(this.websiteConfig);
                
                // parse and create a Sate.Website
                //    > traverse each page:
                //        > parse and compile Sate.Page
                this.site.compile(this.reportAnalyze, this.failWith);
                // @TODO: Parse out errors from compile
            },
            run: function() {
                console.log( "RUN" );
                // flow: 
                // parse and create a Sate.Website
                //  > traverse each page:
                //      > parse and compile Sate.Page
                //  > initialize the server:
                //      > render & return requested Page
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

    // Sate.context = context;
    // var Website = require('./server/Website');
    // // load and process site
    // var Sate.context.site = new Website(Sate.context);
    // 
    // 
    // switch (Sate.context.action) {
    //     case Sate.Action.Run:
    //         var Server = require('./server/Server');
    //         // server to serve pages
    //         context.server = new Server(Sate.context);
    //         break;
    //     case Sate.Action.Generate:
    //         // generator to produce a static site
    //         
    //         break;
    // }
    // 
    // 
    // 
    // 
    // 
    // 
    // var server = require('./server/Server')(context);
    // console.log('Server running at http://127.0.0.1:3000/');

})();