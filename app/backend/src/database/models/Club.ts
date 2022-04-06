import { DataTypes, Model } from 'sequelize';
import db from '.';
import Match from './Match';

class Club extends Model {
  public id: number;

  public clubName: string;
}

Club.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  clubName: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}, {
  underscored: true,
  sequelize: db,
  timestamps: false,
  tableName: 'clubs',
});

Match.belongsTo(Club, {
  foreignKey: 'homeTeam',
  as: 'homeClub',
});

Match.belongsTo(Club, {
  foreignKey: 'awayTeam',
  as: 'awayClub',
});

export default Club;
