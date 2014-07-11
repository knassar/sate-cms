function Help() {
    var extend = require(Sate.nodeModInstallDir+'node.extend'),
        Command = require(__dirname+'/command');
    
    var cmd = extend(true,
        (new Command()),
        {
            _super: (new Command()),
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

var exec = function(args) {
    var cmd = new Help();
    cmd.helpForWhat(args);
    cmd.execute();
};
exec.commandName = 'sate';
module.exports = exec;