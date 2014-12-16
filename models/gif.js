module.exports = function gifModel(bookshelf){
    "use strict";

    var Gif = bookshelf.Model.extend({
        tableName: 'gifs',
        hasTimestamps: true,
        tags: function () {
            return this.belongsToMany('Tag', 'gifs_tags');
        }
    });

    bookshelf.model('Gif', Gif);
    return Gif;
};