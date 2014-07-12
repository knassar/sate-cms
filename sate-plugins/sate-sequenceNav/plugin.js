/**
* Sate Sequence Navigation plugin
* Use like: {{plugin-sate-sequenceNav}}
*/
module.exports = function() {
    var util = require('util');

    var plg = new Sate.Plugin({
        type: 'sate-sequenceNav',
        version: '0.5.0',
        previousPrompt: "previous: ",
        nextPrompt: "next: ",
        compile: function(props, page, complete) {
            this.page = page.pageAscent();
            this.thisPageName = page.name;
            Sate.chain.inPlace(this, props);
            complete.apply();
        },
        templates: {'main': 'sequenceNav.tpl'},
        stylesheets: ['sequence-nav.css'],
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
            var obj = this.prototype.objectToRender.call(this, config, page);
            if (!obj) {
                obj = {};
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
                if (currPageIdx > 0 && !obj.prev) {
                    obj.prev = seq[currPageIdx-1].descriptor();
                }
                else {
                    obj.prev = Sate.pageDescriptor(obj.prev);
                }
                if (obj.prev) {
                    obj.prev.prompt = this.previousPrompt;
                }

                if (currPageIdx < seq.length -1 && !obj.next) {
                    obj.next = seq[currPageIdx+1].descriptor();
                }
                else {
                    obj.next = Sate.pageDescriptor(obj.next);
                }
                if (obj.next) {
                    obj.next.prompt = this.nextPrompt;
                }
                
            }
            
            return obj;
        }
    });
    return plg;
};
