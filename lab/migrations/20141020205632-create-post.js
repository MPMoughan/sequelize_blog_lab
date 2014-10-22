"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Posts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING
      },
      body: {
        type: DataTypes.TEXT
      },
      AuthorId: {
        type: DataTypes.INTEGER,
        foreignKey: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Posts").done(done);
  }
};