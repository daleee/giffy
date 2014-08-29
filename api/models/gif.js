module.exports = function gifModel(bookshelf){
    "use strict";

    var Gif = bookshelf.Model.extend({
        tableName: 'gifs',
        hasTimestamps: true
    });

    return Gif;
};