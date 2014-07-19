if (!Sate) var Sate = {};
if (!Sate.Markup) Sate.Markup = {};

$(function() {

    var shouldExclude = function(el) {
        return (Sate.Markup.config &&
                Sate.Markup.config.exclusionClass &&
                $(el).hasClass("no-sate-markup"));
    };

    if (Sate.Markup.config) {
        
        if (Sate.Markup.config.externalLinks || Sate.Markup.config.externalLinkTarget) {
            var external = /^https?\:\/\//mi;
            $('a[href]').map(function(idx, a) {
                if (external.test($(a).attr('href'))) {
                    return a;
                }
                else {
                    return null;
                }
            }).each(function() {
                if (!shouldExclude(this)) {
                    $el = $(this);
                    if (Sate.Markup.config.externalLinks) {
                        $el.addClass("external");
                    }
                    if (Sate.Markup.config.externalLinkTarget && !$el.attr('target')) {
                        $el.attr('target', Sate.Markup.config.externalLinkTarget);
                    }
                }
            });
        }
        
    }

});