#!/usr/bin/env node

// IEFE:
(function(){
    
    // Creating the global Sate singleton object
    GLOBAL.Sate = {
        
        // Sate Commands
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

        // sate chain utility
        chain: require(__dirname+'/sate-resources/chain'),

        // Sate utils
        utils: require(__dirname+'/sate-resources/sate-utils'),

        // Sate Enums
        PageType: require(__dirname+'/sate-resources/PageType'),
        Parser: require(__dirname+'/sate-resources/Parser'),
        IndexSort: require(__dirname+'/sate-resources/IndexSort'),

        // Website 
        Website: require(__dirname+'/sate-resources/Website'),
        // Site crawler
        SiteMapGenerator: require(__dirname+'/sate-resources/SiteMapGenerator'),
        
        // Page
        Page: require(__dirname+'/sate-resources/Page'),

        // Sate Server
        Server: require(__dirname+'/sate-resources/Server'),

        // Logging
        Log: require(__dirname+'/sate-resources/Log'),
        LogLevel: {
            Quiet: -1,
            Normal: 0,
            Verbose: 10
        },
        
        // currently invoked Sate command name
        executingCommand: null,
        
        // node_modules directory relative to where Sate has been installed
        nodeModInstallDir: __dirname + '/node_modules/',


        // Plugin prototype
        Plugin: require(__dirname+'/sate-resources/Plugin'),
        // RequestHandler prototype
        RequestHandler: require(__dirname+'/sate-resources/RequestHandler'),
        // global static config for plugins
        pluginConfig: {},
        configForPlugin: function(pluginType) {
            if (!this.pluginConfig.hasOwnProperty(pluginType)) {
                this.pluginConfig[pluginType] = {};
            }
            return this.pluginConfig[pluginType];
        },
        
        // registered RequestHandlers
        resourceRequestHandlers:{},
        registerRequestHandler: function(requestHandler) {
            this.resourceRequestHandlers[requestHandler.requestPattern] = {
                pattern: requestHandler.requestPattern,
                handler: requestHandler
            };
        }
    };

    // Command aliases
    Sate.Command.build = Sate.Command.deploy;
    Sate.Command.new = Sate.Command.create;
    Sate.Command.dev = Sate.Command.develop;
    

    // default command
    var command = Sate.Command.help;

    // if invoked from source, the first argument will actually be this script name, so skip it:
    var argp = process.argv.shift(),
        sateCheck = /sate/;
    while (!sateCheck.test(argp)) {
        argp = process.argv.shift();
    }
    
    // Process the CLI args:
    var args = process.argv.slice(0);
    if (!args[0]) {
        Sate.Command.help(null);
        process.exit(0);
    } else if (args[0].length > 0) {
        if (Sate.Command.hasOwnProperty(args[0])) {
            command = Sate.Command[args[0]];
            Sate.executingCommand = args[0];
            process.argv.shift();
        } else {
            Sate.Command.help(null);
            process.exit(0);
        }
    }

    // Execute the Command
    command.call(this, process.argv);

})();