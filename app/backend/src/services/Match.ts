import Match from '../database/models/Match';
import Club from '../database/models/Club';
import { getTotalGoals, getTotals, getTotalStatus } from '../middlewares/MatchResults';
import orderRatings from '../middlewares/SortResults';

const getAll = async () => {
  const matchData = await Match.findAll({
    include: [
      { model: Club, as: 'homeClub', attributes: { exclude: ['id'] } },
      { model: Club, as: 'awayClub', attributes: { exclude: ['id'] } },
    ],
  });
  return { status: 200, data: matchData };
};

const getByProgress = async (inProgress: boolean) => {
  const matchData = await Match.findAll({
    where: { inProgress },
    include: [
      { model: Club, as: 'homeClub', attributes: { exclude: ['id'] } },
      { model: Club, as: 'awayClub', attributes: { exclude: ['id'] } },
    ] });
  return { status: 200, data: matchData };
};

const startMatch = async (data: object) => {
  const newMatch = await Match.create({ ...data });
  return newMatch;
};

const endMatch = async (id: string) => {
  const inProgress = false;
  const updateMatch = await Match.update({ inProgress }, { where: { id } });
  return updateMatch;
};

type MatchGoals = { 
  homeTeamGoals: number, 
  awayTeamGoals: number,
};

const modifyMatch = async (id: string, { homeTeamGoals, awayTeamGoals }: MatchGoals) => {
  const updateMatch = await Match.update(
    { 
      homeTeamGoals, 
      awayTeamGoals, 
    }, 
    { 
      where: { id },
    }
  );
  return updateMatch;
};

const generateRating = async (clubs: Club[], findInHome: boolean, findInAway: boolean) => {
  const { data } = await getByProgress(false);
  const ratings = clubs.map(({ id, clubName }: Club) => {
    const name = clubName;
    const total = getTotals(id, data, findInHome, findInAway);
    const totalStatus = getTotalStatus(id, data, findInHome, findInAway);
    const totalGoals = getTotalGoals(id, data, findInHome, findInAway);
    let efficiency = (total.totalPoints / (total.totalGames * 3)) * 100;
    efficiency = Math.round(efficiency * 100) / 100;
    return { name, ...total, ...totalStatus, ...totalGoals, efficiency };
  });
  return ratings.sort(orderRatings);
};

export default {
  getAll,
  getByProgress,
  startMatch,
  endMatch,
  modifyMatch,
  generateRating,
};
