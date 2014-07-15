Log = function() {
    
    var startTime,
        dash = "-",
        minLineLen = 60;
        
    var xChars = function(char, len) {
        var d = 0;
        var line = [];
        while(d < len) {
            ++d;
            line.push(char);
        }
        return line.join('');
    };
    var logLineDashes = function(minLen) {
        if (!minLen || minLen < minLineLen) {
            minLen = minLineLen;
        }
        return xChars(dash, minLen);
    };

    var color;
    var getColor = function() {
        if (!color) {
            color = require(Sate.nodeModInstallDir+'cli-color');
        }
        return color;
    }
    
    var logErr = function(string) {
        console.error(getColor().redBright(string));
    };
    
    var logSuccess = function(string) {
        console.log(getColor().green(string));
    };
    
    var logOK = function(string, level) {
        switch (level) {
        case 0:
            console.log(getColor().whiteBright(string))
            break;

        default:
            console.log(getColor().blackBright(string))
        }
    };

    var logBox = function(lines, textColor) {
        var boxWidth = minLineLen,
            l = 0;
        for (l=0; l < lines.length; l++) {
            if (lines[l].length > boxWidth) {
                boxWidth = lines[l].length;
            }
        }
        var color = getColor()[textColor];
        console.log( " +"+logLineDashes(boxWidth)+"+" );
        for (l=0; l < lines.length; l++) {
            console.log(" | "+ color(lines[l]) + xChars(" ", boxWidth-lines[l].length-2) +" |");
        }
        console.log( " +"+logLineDashes(boxWidth)+"+" );
    };
    
    var logLevel = 0;
    
    var log = {
        setLogLevel: function(level) {
            logLevel = level;
        },
        logSeparator: function() {
            console.log( " +"+logLineDashes() );
        },
        logSuccess: function(msg) {
            logSuccess( " +"+xChars(dash, 1)+"> "+msg);
        },
        logAction: function(msg, depth) {
            if (depth - logLevel < 1) {
                logOK( " +"+xChars(dash, depth * 2 + 1)+"> "+msg, depth);
            }
        },
        logError: function(msg, depth, err) {
            logErr( " \u00D7"+xChars(dash, depth * 2 + 1)+"> "+msg );
            if (err) {
                logErr( "    "+xChars('>', depth * 2 - 1)+"> "+err.message );
            }
        },
        startBox: function(lines) {
            if (logLevel < 0) {
                lines.forEach(function(msg) {
                    logOK( " >>> "+msg, 0);
                });
            }
            else {
                logBox(lines, "whiteBright");
            }
        },
        successBox: function(lines) {
            if (logLevel < 0) {
                lines.forEach(function(msg) {
                    logSuccess( " >>> "+msg);
                });
            }
            else {
                logBox(lines, "green");
            }
        },

        failWith: function(message, err) {
            logErr(message);
            logErr("FAILED with Error: " + err.message);
            process.exit(1);
        },
        markStartTime: function() {
            startTime = new Date();
        },
        executionTime: function() {
            return (new Date()).getTime() - startTime.getTime();
        }
    };
    return log;
};
module.exports = new Log();