/**
* Sate Sequence Navigation plugin
* Use like: {{plugin-sate-sequenceNav}}
*/
module.exports = function(Sate) {
    var Plugin = require(__dirname+'/../Plugin'),
        util = require('util');

    var plg = new Plugin(Sate, {
        type: 'sate-sequenceNav',
        version: '0.4.0',
        previousPrompt: "previous: ",
        nextPrompt: "next: ",
        compile: function(props, page, Sate, complete) {
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
            var obj = this.super.objectToRender(config, page);
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
            var website = page.rootPage().website;
            if (seq) {
                currPageIdx = -1;
                for (var i=0; i < seq.length; i++) {
                    if (page.url == seq[i].url) {
                        currPageIdx = i;
                        break;
                    }
                }
                if (currPageIdx > 0 && !obj.prev) {
                    obj.prev = {
                        name: seq[currPageIdx-1].name,
                        url: seq[currPageIdx-1].url
                    };
                }
                else if (typeof obj.prev == 'string') {
                    var prevPage = website.pageForPath(obj.prev);
                    obj.prev = {
                        name: prevPage.name,
                        url: prevPage.url
                    }
                }
                
                if (typeof obj.prev == 'object') {
                    obj.prev = Sate.chain({
                        prompt: this.previousPrompt
                    }, obj.prev);
                }

                if (currPageIdx < seq.length -1 && !obj.next) {
                    obj.next = {
                        name: seq[currPageIdx+1].name,
                        url: seq[currPageIdx+1].url
                    };
                }
                else if (typeof obj.next == 'string') {
                    var nextPage = website.pageForPath(obj.next);
                    obj.next = {
                        name: nextPage.name,
                        url: nextPage.url
                    }
                }

                if (typeof obj.next == 'object') {
                    obj.next = Sate.chain({
                        prompt: this.nextPrompt
                    }, obj.next);
                }
            }
            
            this.composeClasses(obj);
            
            return obj;
        }
    });
    return plg;
};
