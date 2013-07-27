module.exports = function(args, Sate) {
    var Command = require(__dirname+'/command');
    var cmd = new Command(Sate);
    cmd.help();
};
