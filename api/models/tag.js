module.exports = function tagModel(bookshelf){
    "use strict";

    var Tag = bookshelf.Model.extend({
        tableName: 'tags'
    });

    return Tag;
};
