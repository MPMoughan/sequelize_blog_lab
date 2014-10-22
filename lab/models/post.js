"use strict";

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    AuthorId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(db) {
        db.Post.belongsTo(db.Author)
      }
    }
  });

  return Post;
};
