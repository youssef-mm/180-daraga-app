const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Meeting = sequelize.define('Meeting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmationDeadline: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Meeting;
};