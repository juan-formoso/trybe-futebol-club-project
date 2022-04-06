/* eslint-disable max-lines-per-function */
import { Request, Response } from 'express';
import IClubStatistics from '../interfaces/ClubStatistics';
import IMatch from '../interfaces/Match';
import ClubModel from '../database/models/Club';
import MatchModel from '../database/models/Match';

// Busca todas as partidas com foco nos times da casa
const returnAllMatchs = async () => {
  const result = await MatchModel.findAll({
    where: { inProgress: false },
    include: [
      { model: ClubModel, as: 'awayClub', attributes: { exclude: ['id'] } },
    ],
  });
  return result;
};

// Retorna o objeto com a estrutura das estatísticas que cada clube deve ter
const clubStructure = (name: string | undefined) => {
  const result = {
    name,
    totalPoints: 0,
    totalGames: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
    goalsBalance: 0,
    efficiency: 0,
  };
  return result;
};

// Atualiza as estatísticas de cada clube
const setLeaderBoardAwayData = (clubMatch: IMatch, clubObj: IClubStatistics) => {
  const objVal = clubObj;

  if (clubMatch.awayTeamGoals > clubMatch.homeTeamGoals) {
    objVal.totalVictories += 1;
    objVal.totalPoints += 3;
  }

  if (clubMatch.awayTeamGoals === clubMatch.homeTeamGoals) {
    objVal.totalDraws += 1;
    objVal.totalPoints += 1;
  }

  if (clubMatch.awayTeamGoals < clubMatch.homeTeamGoals) {
    objVal.totalLosses += 1;
  }

  objVal.totalGames += 1;
  objVal.goalsFavor += clubMatch.awayTeamGoals;
  objVal.goalsOwn += clubMatch.homeTeamGoals;
  objVal.goalsBalance = objVal.goalsFavor - objVal.goalsOwn;
  objVal.efficiency = parseFloat(((objVal.totalPoints / (objVal.totalGames * 3)) * 100).toFixed(2));

  return objVal;
};

const sortLeaderBoardAway = (clubsStatisticsData: IClubStatistics[]) => {
  clubsStatisticsData.sort((a, b) => {
    if (a.totalPoints > b.totalPoints) return -1;
    if (b.totalPoints > a.totalPoints) return 1;
    if (a.totalVictories > b.totalVictories) return -1;
    if (b.totalVictories > a.totalVictories) return 1;
    if (a.goalsBalance > b.goalsBalance) return -1;
    if (b.goalsBalance > a.goalsBalance) return 1;
    if (a.goalsFavor > b.goalsFavor) return -1;
    if (b.goalsFavor > a.goalsFavor) return 1;
    if (a.goalsOwn > b.goalsOwn) return 1;
    if (b.goalsOwn > a.goalsOwn) return -1;
    return 0;
  });
  return clubsStatisticsData;
};

// Função que vai atualizar os dados do leaderBoardHome
const leaderBoardAwayData = async () => {
  const clubsStatisticsData: IClubStatistics[] = [];

  const allClubs = await ClubModel.findAll();
  const allMatchs = await returnAllMatchs();

  allClubs.forEach((club) => {
    const clubObj = clubStructure(club.clubName);
    allMatchs.forEach((match: IMatch) => {
      if (clubObj.name === match.awayClub?.clubName) {
        setLeaderBoardAwayData(match, clubObj);
      }
    });
    clubsStatisticsData.push(clubObj);
  });

  return clubsStatisticsData;
};

const leaderBoardAway = async (_req: Request, res: Response) => {
  const result = await leaderBoardAwayData();
  const resultSorted = sortLeaderBoardAway(result);
  res.status(200).json(resultSorted);
};

export default leaderBoardAway;
