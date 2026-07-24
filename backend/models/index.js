const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'database_development',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  }
);

const meetingFactory = require('./meeting');
const responseFactory = require('./response');

const Meeting = meetingFactory(sequelize, DataTypes);
const Response = responseFactory(sequelize, DataTypes);

Meeting.hasMany(Response, { foreignKey: 'meetingId', onDelete: 'CASCADE' });
Response.belongsTo(Meeting, { foreignKey: 'meetingId' });

module.exports = {
  sequelize,
  Meeting,
  Response,
};