/**
* Sate Sequence Navigation plugin
* Use like: {{plugin-sate-sequenceNav}}
*/
module.exports = function(Sate) {
    var Plugin = require(__dirname+'/../Plugin'),
        util = require('util');

    var plg = new Plugin(Sate, {
        type: 'sate-sequenceNav',
        version: '0.2.0',
        previousPrompt: "previous: ",
        nextPrompt: "next: ",
        compile: function(props, page, Sate, complete) {
            this.page = page.pageAscent();
            this.thisPageName = page.name;
            this.extendWithProperties(props);
            complete.apply();
        },
        templates: {'main': __dirname+'/sequenceNav.tpl'},
        stylesheets: ['/sate-cms/plugins/sate-sequenceNav/sequence-nav.css'],
        closestIndexPage: function(page) {
            if (page.parent) {
                do {
                    page = page.parent;
                } while (page.type != Sate.PageType.Index && page.parent);
            }
            if (page.type == Sate.PageType.Index) {
                return page;
            }
            else {
                return null;
            }
        },
        objectToRender: function(config, page) {
            var obj = this.super.objectToRender(config, page);
            if (!obj) {
                obj = {};
            }
            if (util.isArray(obj.classes)) {
                obj.classes.push('plugin-sate-sequenceNav');
                obj.classes = obj.classes.join(' ');
            }
            var seq = obj.sequence;
            if (!seq) {
                var index = this.closestIndexPage(page);
                if (index) {
                    seq = index.articles;
                }
            }
            if (seq) {
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
            }
            return obj;
        }
    });
    return plg;
};
