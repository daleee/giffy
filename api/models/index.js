module.exports = function modelIndex(bookshelf) {
    var gif = require('./gif')(bookshelf);
    return {
        Gif: gif
    };
};