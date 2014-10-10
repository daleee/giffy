module.exports = function tagModel(bookshelf){
    "use strict";

    var Tag = bookshelf.Model.extend({
        tableName: 'tags',
        gifs: function () {
            return this.belongsToMany(Gif, 'gifs_tags');
        }
    });

    return Tag;
};
