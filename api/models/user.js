module.exports = function gifModel(bookshelf){
    "use strict";

    var User = bookshelf.Model.extend({
        tableName: 'users',
        hasTimestamps: true
    });

    return User;
};
