/**
* Sate Sequence Navigation plugin
* Use like: {{plugin-sate-sequenceNav}}
*/
module.exports = function(Sate) {
    var Mustache = require('mustache'),
        extend = require('node.extend');

    var sequenceItemTpl = '<div class="{{nextPrev}}"><span class="prompt">{{nextPrevPrompt}}</span><a href="{{url}}">{{name}}</a></div>';

    return {
        renderer: function() {
            return function(config, render) {
                try { 
                    config = JSON.parse(config);
                } catch (err) {
                    config = {};
                }
                var seq = this.sequence;
                if (!seq && this.menu && this.menu.sub) {
                    seq = this.menu.sub.slice(0, this.menu.sub.length);
                }
                nav = [];
                currPageIdx = -1;
                for (var i=0; i < seq.length; i++) {
                    if (this.url == seq[i].url) {
                        currPageIdx = i;
                        nav.push('');
                        continue;
                    }
                    var item;
                    if (currPageIdx > -1 && currPageIdx < i) {
                        item = {
                            nextPrev: 'next',
                            nextPrevPrompt: this.sequenceNavPrompt.next
                        };
                    } else {
                        item = {
                            nextPrev: 'previous',
                            nextPrevPrompt: this.sequenceNavPrompt.previous
                        };
                    }
                    item = extend(seq[i], item);
                    nav.push(Mustache.render(sequenceItemTpl, item));
                }
                if (currPageIdx === 0) {
                    nav = nav.slice(0, 2);
                } else if (currPageIdx == seq.length-1) {
                    nav = nav.slice(currPageIdx-1);
                } else {
                    nav = nav.slice(currPageIdx-1);
                    if (nav.length > 3) {
                        nav.length = 3;
                    }
                }
                return '<div class="sequence-nav">' + nav.join('') + '</div>';
            };
        }
    };
};
