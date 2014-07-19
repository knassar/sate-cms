if (!Sate) var Sate = {};
$(function() {
    (function() {
        Sate.Gallery = (function() {
            var $viewer = $('<div id="sateGalleryHeroViewer"><div class="bg"></div><div class="images"><img class="hero-a"/><img class="hero-b"/></div><a class="nav close">&times; close</a><a class="nav prev">&lsaquo; previous</a><a class="nav next">next &rsaquo;</a><div id="galleryTitle"></div></div>').appendTo($('body')),
                $galleries = $('ul.sate-gallery'),
                $imgCarrier = $viewer.children('div.images'),
                $imgs = $galleries.find('li.thumbnail > img'),
                $prev = $viewer.find('a.prev'),
                $next = $viewer.find('a.next'),
                $close = $viewer.find('a.close'),
                $imgA = $viewer.find('img.hero-a'),
                $imgB = $viewer.find('img.hero-b'),
                $galleryTitle = $viewer.find('#galleryTitle'),
                timer = null,
                loopSpd = 10,
                loopQueue = [],
                scheduled = {},
                schedCount = 0,
                viewingIndex = -1;
            
            var imgs = [];
            var transition = false;
            var currentTitle = "";
            
            var enqueue = function(fn) {
                loopQueue.push(fn);
                startTimer();
            };

            var schedule = function(key, fn, time) {
                scheduled[key] = {
                    fn: fn,
                    time: time
                };
                schedCount++;
                startTimer();
            };
            
            var unschedule = function(key) {
                schedCount--;
                delete scheduled[key];
            };
            
            var tic = function() {
                var fn = loopQueue.pop();
                if (fn) {
                    fn.apply();
                }
                for (var s in scheduled) {
                    if (scheduled.hasOwnProperty(s) && typeof scheduled[s].fn == 'function') {
                        scheduled[s].time -= loopSpd;
                        if (scheduled[s].time <= 0) {
                            scheduled[s].fn.apply();
                            unschedule(s);
                        }
                    }
                }
                stopTimer();
            };

            var startTimer = function() {
                if (!timer) {
                    timer = setInterval(tic, loopSpd);
                }
            };

            var stopTimer = function(force) {
                if (force || loopQueue.length + schedCount == 0) {
                    clearInterval(timer);
                    timer = null;
                }
            };

            $imgs.each(function(idx, el) {
                $(el).data('img-idx', idx);
                var img = new Image();
                img.src = $(el).data('hero-src');
                imgs.push(img);
            });

            var adjustNav = function() {
                if (viewingIndex === 0) {
                    $prev.css({opacity: 0});
                } else {
                    $prev.css({opacity: 1});
                }
                if (viewingIndex == imgs.length - 1) {
                    $next.css({opacity: 0});
                } else {
                    $next.css({opacity: 1});
                }
            };
            
            var showViewer = function() {
                $viewer.css({display: 'block'});
                adjustNav();
                $(window).on('keydown.sate-gallery', keyNav);
                enqueue(function() {
                    $viewer.css({opacity: 1});
                }, 10);
            };
            
            var hideViewer = function() {
                $viewer.css({opacity: 0});
                $(window).off('keydown.sate-gallery');
                enqueue(function() {
                    $viewer.css({display: 'none'});
                    stopTimer(true);
                }, 30);
            };
            
            var next = function() {
                if (!transition && viewingIndex < imgs.length-1) {
                    transition = true;
                    viewByIndex(viewingIndex+1);
                    adjustNav();
                }
            };
            var prev = function() {
                if (!transition && viewingIndex > 0) {
                    transition = true;
                    viewByIndex(viewingIndex-1);
                    adjustNav();
                }
            };
            
            var keyNav = function(event) {
                switch (event.which) {
                    case 39: // right arrow
                    case 78: // n
                        next();
                        break;
                    case 37: // left arrow
                    case 80: // p
                        prev();
                        break;
                    case 88: // x
                    case 27: // ESC
                        hideViewer();
                        break;
                }
            };

            var repositionImg = function($img) {
                enqueue(function() {
                    var w = $img.width(),
                        h = $img.height(),
                        vW = $imgCarrier.width(),
                        vH = $imgCarrier.height(),
                        asp = w / h,
                        offsetH = false;

                    if (w > vW) {
                        h -= (w - vW) / asp;
                        w = vW;
                        offsetH = true;
                    }
                    $img.css({left: (vW - w) / 2});
                    if (offsetH) {
                        $img.css({top: (vH - h) / 2, height: h});
                    }
                    enqueue(function() {
                        transition = false;
                    }, 24);
                }, 5);
            };
            
           var viewHero = function(heroSRC) {
                showViewer();
                if ($imgA.hasClass('showing')) {
                    $imgB.removeAttr('style').css({opacity:1}).attr('src', heroSRC).addClass('showing');
                    $imgA.css({opacity:0}).removeClass('showing');
                    repositionImg($imgB);
                } else {
                    $imgA.removeAttr('style').css({opacity:1}).attr('src', heroSRC).addClass('showing');
                    $imgB.css({opacity:0}).removeClass('showing');
                    repositionImg($imgA);
                }
            };

            var setGalleryTitleForIndex = function(idx) {
                var title = $($imgs[idx]).parents('ul.sate-gallery').attr('title');
                if (title != currentTitle) {
                    showTitle(title);
                }
            };

            var showingTitle = false;
            var titleFadeOutInterval;
            var showTitle = function(title) {
                currentTitle = title;
                if (showingTitle) {
                    hideTitle();
                    schedule(function() {
                        showTitle(title);
                    }, 300);
                    return;
                }
                else {
                    $galleryTitle.text(currentTitle);
                    $galleryTitle.css({opacity:1});
                    schedule(function() {
                        showingTitle = true;
                    }, 300);
                    schedule('hideTitle', hideTitle, 1500);
                }
            };
            
            var hideTitle = function() {
                $galleryTitle.css({opacity:0});
                unschedule('hideTitle');
                schedule(function() {
                    showingTitle = false;
                }, 250);
            };

            var viewByIndex = function(idx) {
                var heroSRC = imgs[idx].src;
                if (heroSRC) {
                    viewingIndex = idx;
                    viewHero(heroSRC);
                }
                setGalleryTitleForIndex(idx);
            };

            $galleries.on('click.sate-gallery', function(event) {
                var idx = $(event.target).data('img-idx');
                if (idx > -1) {
                    viewByIndex(idx);
                    event.stopPropagation();
                }
            });
            $next.on('click', function() {
                enqueue(next);
            });
            $prev.on('click', function() {
                enqueue(prev);
            });
            $close.on('click', function() {
                enqueue(hideViewer);
            });
            $(window).on('click.sate-gallery', function(event) {
                if ($(event.target).closest('#sateGalleryHeroViewer').length === 0) {
                    hideViewer();
                }
            });
        }());
    }(Sate));
});