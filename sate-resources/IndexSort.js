// Sate.IndexSort
module.exports = {
    DateDescending: function(a, b) {
        if (a.date && b.date) {
            return b.date.getTime() - a.date.getTime();
        } else if (a.date && !b.date) {
            return 1;
        } else {
            return -1;
        }
    },
    DateAscending: function(a, b) {
        if (a.date && b.date) {
            return a.date.getTime() - b.date.getTime();
        } else if (a.date && !b.date) {
            return -1;
        } else {
            return 1;
        }
    }
};
