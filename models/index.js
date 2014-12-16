module.exports = function modelIndex(bookshelf) {
    var tag = require('./tag')(bookshelf);
    var gif = require('./gif')(bookshelf);
    var user = require('./user')(bookshelf);
    return {
        Gif: gif,
        Tag: tag,
        User: user
    };
};
