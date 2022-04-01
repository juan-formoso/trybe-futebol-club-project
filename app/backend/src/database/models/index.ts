import { Sequelize } from 'sequelize';

const databaseConfig = require('../config/database');

export default new Sequelize(databaseConfig);
export { default as User } from './User';
export { default as Match } from './Match';
export { default as Club } from './Club';
