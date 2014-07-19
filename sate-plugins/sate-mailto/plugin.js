/**
* Sate Implementation of Email Obfuscator:

    // Email obfuscator script 2.1 by Tim Williams, University of Arizona
    // Random encryption key feature by Andrew Moulden, Site Engineering Ltd
    // This code is freeware provided these four comment lines remain intact
    // A wizard to generate this code is at http://www.jottings.com/obfuscator/

* Use like: {{{sate-mailto}}}
*/


function rand(number) {
    var rnd = (((new Date()).getTime() * 9301 + 49297) % 233280) / 233280.0;
	return Math.ceil(rnd * number);
};

function munge(obj) {

	var address = obj.mailto.toLowerCase(),
	    unmixedkey = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
	    inprogresskey = unmixedkey,
	    mixedkey = "",
	    unshuffled = 62;
        
	for (i = 0; i <= 62; i++) {
		var ranpos = rand(unshuffled) - 1;
		var nextchar = inprogresskey.charAt(ranpos);
		mixedkey += nextchar;
		var before = inprogresskey.substring(0, ranpos);
		var after = inprogresskey.substring(ranpos + 1, unshuffled);
		inprogresskey = before + after;
		unshuffled -= 1;
	}
    
	var cipher = mixedkey,
	    shift = address.length,
	    coded = "",
        chr;
        
    for (j = 0; j < address.length; j++) {
			if (cipher.indexOf(address.charAt(j)) == -1 ) {
				chr = address.charAt(j);
				coded += address.charAt(j);
			}
			else {
                chr = (cipher.indexOf(address.charAt(j)) + shift) % cipher.length;
                coded += cipher.charAt(chr);
			}
    }

    obj.coded = coded;
    obj.cipher = cipher;
}

module.exports = function() {

    var plg = new Sate.Plugin({
        type: 'sate-mailto',
        version: '0.5.0',
        // compile: function(props, page, complete) {
        //     Sate.chain.inPlace(this.config, props);
        //     complete.apply();
        // },
        linkText: "",
        noScriptText: null,
        
        templates: {'main': 'mailto.tpl'},
        // scripts: ['sate-mailto.js'],

        objectToRender: function(config, page) {
            var obj = this.prototype.objectToRender.call(this, config, page);
            if (!obj) {
                obj = {
                    config: {}
                };
            }
            
            if (!obj.mailto) {
                return false;
            }
            else {
                munge(obj);
                return obj;
            }
        }
    });
    return plg;
};
