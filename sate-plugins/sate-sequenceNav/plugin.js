/**
* Sate Sequence Navigation plugin
* Use like: {{plugin-sate-sequenceNav}}
*/
module.exports = function(Sate) {
    var Plugin = require(__dirname+'/../Plugin'),
        util = require('util');

    var plg = new Plugin(Sate, {
        type: 'sate-sequenceNav',
        version: '0.1.0',
        previousPrompt: "previous: ",
        nextPrompt: "next: ",
        classes: [],
        compile: function(props, page, Sate) {
            this.page = page.pageAscent();
            this.thisPageName = page.name;
            this.extendWithProperties(props);
        },
        templates: {'main': __dirname+'/sequenceNav.tpl'},
        stylesheets: ['/sate-cms/plugins/sate-sequenceNav/sequence-nav.css'],

        objectToRender: function(config, page) {
            var obj;
            if (config.id) {
                obj = page.pluginById(config.id);
            } else if (config.forClass) {
                obj = page.pluginByTypeAndClassName(this.type, config.forClass);
            }
            if (!obj) {
                obj = page.pluginFirstByType(this.type);
            }
            if (!obj) {
                obj = {};
            } else {
                obj.extendWithProperties(config);
            }
            if (util.isArray(obj.classes)) {
                obj.classes.push('plugin-sate-sequenceNav');
                obj.classes = obj.classes.join(' ');
            }
            var seq = obj.sequence;
            if (!seq && page.menu && page.menu.sub) {
                seq = page.menu.sub.slice(0, page.menu.sub.length);
            }
            currPageIdx = -1;
            for (var i=0; i < seq.length; i++) {
                if (page.url == seq[i].url) {
                    currPageIdx = i;
                    break;
                }
            }
            if (currPageIdx > 0) {
                obj.prev = {
                    prompt: this.previousPrompt,
                    name: seq[currPageIdx-1].name,
                    url: seq[currPageIdx-1].url
                };
            }
            if (currPageIdx < seq.length -1) {
                obj.next = {
                    prompt: this.nextPrompt,
                    name: seq[currPageIdx+1].name,
                    url: seq[currPageIdx+1].url
                };
            }
            return obj;
        }
    });
    return plg;
};
