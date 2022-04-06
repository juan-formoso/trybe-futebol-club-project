import Matchs from '../database/models/Match';

const getMatchPointsHome = (homeTeamGoals: number, awayTeamGoals: number) => {
  let pointsInMatch = 0;
  if (homeTeamGoals > awayTeamGoals) pointsInMatch += 3;
  if (homeTeamGoals === awayTeamGoals) pointsInMatch += 1;
  return pointsInMatch;
};

const getMatchPointsAway = (homeTeamGoals: number, awayTeamGoals: number) => {
  let pointsInMatch = 0;
  if (awayTeamGoals > homeTeamGoals) pointsInMatch += 3;
  if (awayTeamGoals === homeTeamGoals) pointsInMatch += 1;
  return pointsInMatch;
};

const getMatchStatusHome = (homeTeamGoals: number, awayTeamGoals: number) => {
  let victorie = 0;
  let draw = 0;
  let defeat = 0;
  if (homeTeamGoals > awayTeamGoals) victorie = 1;
  if (homeTeamGoals === awayTeamGoals) draw = 1;
  if (homeTeamGoals < awayTeamGoals) defeat = 1;
  return { victorie, draw, defeat };
};

const getMatchStatusAway = (homeTeamGoals: number, awayTeamGoals: number) => {
  let victorie = 0;
  let draw = 0;
  let defeat = 0;
  if (awayTeamGoals > homeTeamGoals) victorie = 1;
  if (awayTeamGoals === homeTeamGoals) draw = 1;
  if (awayTeamGoals < homeTeamGoals) defeat = 1;
  return { victorie, draw, defeat };
};

export const getTotals = (id: number, data: Matchs[], home: boolean, away: boolean) => {
  let totalGames = 0;
  let totalPoints = 0;
  data.forEach((match: Matchs) => {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = match;
    if (homeTeam === id && home) {
      totalGames += 1;
      totalPoints += getMatchPointsHome(homeTeamGoals, awayTeamGoals);
    }
    if (awayTeam === id && away) {
      totalGames += 1;
      totalPoints += getMatchPointsAway(homeTeamGoals, awayTeamGoals);
    }
  });
  return { totalPoints, totalGames };
};

export const getTotalStatus = (id: number, data: Matchs[], home: boolean, away: boolean) => {
  let totalVictories = 0;
  let totalDraws = 0;
  let totalLosses = 0;
  data.forEach(({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }: Matchs) => {
    if (homeTeam === id && home) {
      const statusMatch = getMatchStatusHome(homeTeamGoals, awayTeamGoals);
      totalVictories += statusMatch.victorie;
      totalDraws += statusMatch.draw;
      totalLosses += statusMatch.defeat;
    }
    if (awayTeam === id && away) {
      const statusMatch = getMatchStatusAway(homeTeamGoals, awayTeamGoals);
      totalVictories += statusMatch.victorie;
      totalDraws += statusMatch.draw;
      totalLosses += statusMatch.defeat;
    }
  });
  return { totalVictories, totalDraws, totalLosses };
};

export const getTotalGoals = (id: number, data: Matchs[], home: boolean, away: boolean) => {
  let goalsFavor = 0;
  let goalsOwn = 0;
  let goalsBalance = 0;
  data.forEach(({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }: Matchs) => {
    if (homeTeam === id && home) {
      goalsFavor += homeTeamGoals;
      goalsOwn += awayTeamGoals;
    }
    if (awayTeam === id && away) {
      goalsFavor += awayTeamGoals;
      goalsOwn += homeTeamGoals;
    }
  });
  goalsBalance = goalsFavor - goalsOwn;
  return { goalsFavor, goalsOwn, goalsBalance };
};
