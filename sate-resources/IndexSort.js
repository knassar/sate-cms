// Sate.IndexSort
module.exports = {
    DateDescending: function(a, b) {
        if (a && b) {
            if (a.date && b.date) {
                return b.date.getTime() - a.date.getTime();
            } else if (a.date && !b.date) {
                return 1;
            }
        }
        return -1;
    },
    DateAscending: function(a, b) {
        if (a && b) {
            if (a.date && b.date) {
                return a.date.getTime() - b.date.getTime();
            } else if (a.date && !b.date) {
                return -1;
            }
        }
        return 1;
    },
    ManualOrder: function(urls) {
        var orderedUrls = Array.prototype.slice.call(arguments)[0];
        var sorter = function(a, b) {
            var aIdx = (a) ? orderedUrls.indexOf(a.url) : -1;
            var bIdx = (b) ? orderedUrls.indexOf(b.url) : -1;
            
            if (aIdx > -1 && bIdx > -1) {
                return aIdx - bIdx;
            } else if (aIdx > -1 && bIdx == -1) {
                return -1;
            } else {
                return 1;
            }
        };
        return sorter;
    }
};
