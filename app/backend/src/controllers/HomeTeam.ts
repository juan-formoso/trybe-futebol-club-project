import { Request, Response } from 'express';
import IClubStatistics from '../interfaces/ClubStatistics';
import IMatch from '../interfaces/Match';
import ClubModel from '../database/models/Club';
import MatchModel from '../database/models/Match';

const returnAllMatchs = async () => {
  const result = await MatchModel.findAll({
    where: { inProgress: false },
    include: [
      { model: ClubModel, as: 'homeClub', attributes: { exclude: ['id'] } },
    ],
  });
  return result;
};

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

const setLeaderBoardHomeData = (clubMatch: IMatch, clubObj: IClubStatistics) => {
  const objVal = clubObj;
  if (clubMatch.homeTeamGoals > clubMatch.awayTeamGoals) {
    objVal.totalVictories += 1;
    objVal.totalPoints += 3;
  }
  if (clubMatch.homeTeamGoals === clubMatch.awayTeamGoals) {
    objVal.totalDraws += 1;
    objVal.totalPoints += 1;
  }
  if (clubMatch.homeTeamGoals < clubMatch.awayTeamGoals) {
    objVal.totalLosses += 1;
  }
  objVal.totalGames += 1;
  objVal.goalsFavor += clubMatch.homeTeamGoals;
  objVal.goalsOwn += clubMatch.awayTeamGoals;
  objVal.goalsBalance = objVal.goalsFavor - objVal.goalsOwn;
  objVal.efficiency = parseFloat(((objVal.totalPoints / (objVal.totalGames * 3)) * 100).toFixed(2));
  return objVal;
};

const sortLeaderBoardHome = (clubsStatisticsData: IClubStatistics[]) => {
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

const leaderBoardHomeData = async () => {
  const clubsStatisticsData: IClubStatistics[] = [];
  const allClubs = await ClubModel.findAll();
  const allMatchs = await returnAllMatchs();
  allClubs.forEach((club) => {
    const clubObj = clubStructure(club.clubName);
    allMatchs.forEach((match: IMatch) => {
      if (clubObj.name === match.homeClub?.clubName) {
        setLeaderBoardHomeData(match, clubObj);
      }
    });
    clubsStatisticsData.push(clubObj);
  });
  return clubsStatisticsData;
};

const leaderBoardHome = async (_req: Request, res: Response) => {
  const result = await leaderBoardHomeData();
  const resultSorted = sortLeaderBoardHome(result);
  res.status(200).json(resultSorted);
};

export default leaderBoardHome;
