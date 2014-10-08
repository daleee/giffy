module.exports = function gifModel(bookshelf, Tag){
    "use strict";

    var Gif = bookshelf.Model.extend({
        tableName: 'gifs',
        hasTimestamps: true,
        tags: function () {
            return this.belongsToMany(Tag, 'gifs_tags');
        }
    });

    return Gif;
};