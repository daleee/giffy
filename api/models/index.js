module.exports = function modelIndex(bookshelf) {
    var tag = require('./tag')(bookshelf);
    var gif = require('./gif')(bookshelf, tag);
    return {
        Gif: gif,
        Tag: tag
    };
};