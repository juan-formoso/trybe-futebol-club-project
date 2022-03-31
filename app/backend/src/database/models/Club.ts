import { Model, DataTypes } from 'sequelize';
import db from '.';
import Match from './Match';

class Club extends Model {
  public id: number;
  public clubName: string;
}

Club.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  clubName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  underscored: true,
  tableName: 'clubs',
  sequelize: db,
  timestamps: false,
});

Club.hasMany(Match, {
  foreignKey: 'id',
  as : 'matchs',
});

Match.belongsTo(Club, { 
  foreignKey: 'id', 
  as: 'clubs' 
});

export default Club;