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
    
    var log = {
        logSeparator: function() {
            console.log( " +"+logLineDashes() );
        },
        logAction: function(msg, depth) {
            console.log( " +"+xChars(dash, depth * 2 + 1)+"> "+msg );
        },
        logError: function(msg, depth) {
            console.log( " X"+xChars(dash, depth * 2 + 1)+"> "+msg );
        },
        logBox: function(lines) {
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
        },
        failWith: function(err) {
            // @TODO: Richer error handling
            console.error(err);
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