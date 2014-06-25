function Help(Sate) {
    var extend = require(Sate.nodeModInstallDir+'node.extend'),
        Command = require(__dirname+'/command');
    
    var cmd = extend(true,
        (new Command(Sate)),
        {
            _super: (new Command(Sate)),
            helpForCommand: null,
            helpForWhat: function(args) {
                if (args) {
                    var cmdIdx = args.indexOf('help');
                    this.helpForCommand = args[cmdIdx+1];
                }
            },
            execute: function() {
                if (this.helpForCommand) {
                    this.help(this.helpForCommand);
                } else {
                    this.help();
                }
            }
        });
    return cmd;
}

module.exports = function(args, Sate) {
    var cmd = new Help(Sate);
    cmd.helpForWhat(args);
    cmd.execute();
};
