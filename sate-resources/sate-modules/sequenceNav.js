var Mustache = require('mustache'),
    extend = require('node.extend'),
    Sate = {
        PageType: require('../PageType')
    };
var sequenceItemTpl = '<div class="{{nextPrev}}"><span class="prompt">{{nextPrevPrompt}}</span><a href="{{url}}">{{name}}</a></div>';
module.exports = function() {
    var seq = this.sequence;
    if (!seq && this.menu && this.menu.sub) {
        var seq = this.menu.sub.splice(0, this.menu.sub.length);
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
    };
    if (currPageIdx === 0) {
        nav = nav.slice(1, 2);
    } else if (currPageIdx == seq.length-1) {
        nav = nav.slice(currPageIdx-1, 2);
    } else {
        nav = nav.slice(currPageIdx-1, 3);
    }
    return '<div class="sequence-nav">' + nav.join('') + '</div>';
};
