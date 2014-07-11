#!/usr/bin/env node
(function(){
    
    var Sate = {
            Command: {
                help:   require(__dirname+'/commands/Help'),
                develop:require(__dirname+'/commands/Develop'),
                run:    require(__dirname+'/commands/Run'),
                analyze:require(__dirname+'/commands/Analyze'),
                deploy: require(__dirname+'/commands/Deploy'),
                // build : alias for 'deploy'
                create: require(__dirname+'/commands/Create'),
                // new : alias for 'create'
                update: require(__dirname+'/commands/Update'),
                docs:   require(__dirname+'/commands/Docs')
            },
            Log: require(__dirname+'/sate-resources/Log'),
            PageType: require(__dirname+'/sate-resources/PageType'),
            Parser: require(__dirname+'/sate-resources/Parser'),
            IndexSort: require(__dirname+'/sate-resources/IndexSort'),
            Website: require(__dirname+'/sate-resources/Website'),
            SiteMapGenerator: require(__dirname+'/sate-resources/SiteMapGenerator'),
            Page: require(__dirname+'/sate-resources/Page'),
            chain: require(__dirname+'/sate-resources/chain'),
            Server: require(__dirname+'/sate-resources/Server'),
            utils: require(__dirname+'/sate-resources/sate-utils'),
            LogLevel: {
                Quiet: 'quiet',
                Normal: 'normal',
                Verbose: 'verbose'
            },
            executingCommand: null,
            nodeModInstallDir: __dirname + '/node_modules/',
            pluginConfig: {},            
            configForPlugin: function(pluginType) {
                if (!this.pluginConfig.hasOwnProperty(pluginType)) {
                    this.pluginConfig[pluginType] = {};
                }
                return this.pluginConfig[pluginType];
            },
            resourceRequestHandlers:{},
            registerRequestHandlerForRequests: function(requestHandler, requestMatcher) {
                this.resourceRequestHandlers[requestMatcher] = {
                    matcher: requestMatcher,
                    handler: requestHandler
                };
            }
        };
        
    Sate.Command.build = Sate.Command.deploy;
    Sate.Command.new = Sate.Command.create;
    
    var sateCMS = {
        command: Sate.Command.develop,
        processCommand: function(processArgv) {
            var argp = processArgv.shift(),
                sateCheck = /sate/;
            while (!sateCheck.test(argp)) {
                argp = processArgv.shift();
            }
            var args = processArgv.slice(0);
            if (!args[0]) {
                Sate.Command.help(null, Sate);
                process.exit(0);
            } else if (args[0].length > 0) {
                if (Sate.Command.hasOwnProperty(args[0])) {
                    this.command = Sate.Command[args[0]];
                    Sate.executingCommand = args[0];
                    processArgv.shift();
                } else {
                    Sate.Command.help(null, Sate);
                    process.exit(0);
                }
            }
        },
        execute: function(process) {
            this.processCommand(process.argv);
            this.command(process.argv, Sate);
        }
    };
        
    sateCMS.execute(process);
})();