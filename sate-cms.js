#!/usr/bin/env node
(function(){
    var Sate = {
            Command: {
                help:   require(__dirname+'/commands/Help'),
                develop:require(__dirname+'/commands/Develop'),
                run:    require(__dirname+'/commands/Run'),
                analyze:require(__dirname+'/commands/Analyze'),
                deploy: require(__dirname+'/commands/Deploy'),
                create: require(__dirname+'/commands/Deploy'),
                update: require(__dirname+'/commands/Deploy'),
                docs:   require(__dirname+'/commands/Docs')
            },
            Log: require(__dirname+'/sate-resources/Log'),
            PageType: require(__dirname+'/sate-resources/PageType'),
            IndexSort: require(__dirname+'/sate-resources/IndexSort'),
            Website: require(__dirname+'/sate-resources/Website'),
            Page: require(__dirname+'/sate-resources/Page'),
            MenuItem: require(__dirname+'/sate-resources/MenuItem'),
            Server: require(__dirname+'/sate-resources/Server'),
            utils: require(__dirname+'/sate-resources/sate-utils'),
            LogLevel: {
                Quiet: 'quiet',
                Normal: 'normal',
                Verbose: 'verbose'
            }
        };

    var sateCMS = {
        command: Sate.Command.develop,
        processCommand: function(processArgv) {
            var argp = processArgv.shift()
                sateCheck = /sate\-cms/;
            while (!sateCheck.test(argp)) {
                argp = processArgv.shift();
            }
            var args = processArgv.slice(0);
            if (args[0].length > 0) {
                if (Sate.Command.hasOwnProperty(args[0])) {
                    this.command = Sate.Command[args[0]];
                    processArgv.shift();
                } else {
                    Sate.Command.help()
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