module.exports = function gifModel(bookshelf){
    var User = bookshelf.Model.extend({
        tableName: 'users',
        hasTimestamps: true
    });

    return User;
}
