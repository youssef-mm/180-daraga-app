const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Response = sequelize.define('Response', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meetingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // اختياري للسماح بتسجيل الحضور بدون حساب
    },
  });

  return Response;
};