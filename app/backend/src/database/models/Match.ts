import { Model, DataTypes } from 'sequelize';
import db from '.';
import Club from './Club';

class Match extends Model {
  public id: number;
  public homeTeam: number;
  public awayTeam: number;
  public homeTeamGoals: number;
  public awayTeamGoals: number;
  public inProgress: boolean;
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  homeTeam: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeam: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  underscored: true,
  tableName: 'matchs',
  sequelize: db,
  timestamps: false,
});

Match.belongsTo(Club, {
  foreignKey: 'homeTeam',
  as: 'homeClub',
});

Match.belongsTo(Club, {
  foreignKey: 'awayTeam',
  as: 'awayClub',
});

Club.hasMany(Match, {
  foreignKey: 'homeTeam',
  as: 'homeMatches',
});

Club.hasMany(Match, {
  foreignKey: 'awayTeam',
  as: 'awayMatches',
});  

export default Match;
