import Matchs from "../database/models/Match";

const getMatchPointsHome = (homeTeamGoals: number, awayTeamGoals: number) => {
  let scoreboard = 0;
  if (homeTeamGoals > awayTeamGoals) scoreboard += 3;
  if (homeTeamGoals === awayTeamGoals) scoreboard += 1;
  return scoreboard;
};

const getMatchPointsAway = (homeTeamGoals: number, awayTeamGoals: number) => {
  let scoreboard = 0;
  if (awayTeamGoals > homeTeamGoals) scoreboard += 3;
  if (awayTeamGoals === homeTeamGoals) scoreboard += 1;
  return scoreboard;
};

const getMatchStatusHome = (homeTeamGoals: number, awayTeamGoals: number) => {
  let wins = 0;
  let draws = 0;
  let losses = 0;
  if (homeTeamGoals > awayTeamGoals) wins = 1;
  if (homeTeamGoals === awayTeamGoals) draws = 1;
  if (homeTeamGoals < awayTeamGoals) losses = 1;
  return { wins, draws, losses };
};

const getMatchStatusAway = (homeTeamGoals: number, awayTeamGoals: number) => {
  let wins = 0;
  let draws = 0;
  let losses = 0;
  if (awayTeamGoals > homeTeamGoals) wins = 1;
  if (awayTeamGoals === homeTeamGoals) draws = 1;
  if (awayTeamGoals < homeTeamGoals) losses = 1;
  return { wins, draws, losses };
};

export const getTotals = (
  id: number,
  data: Matchs[],
  home: boolean,
  away: boolean
) => {
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

export const getTotalStatus = (
  id: number,
  data: Matchs[],
  home: boolean,
  away: boolean
) => {
  let totalWins = 0;
  let totalDraws = 0;
  let totalLosses = 0;
  data.forEach(
    ({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }: Matchs) => {
      if (homeTeam === id && home) {
        const matchStatus = getMatchStatusHome(homeTeamGoals, awayTeamGoals);
        totalWins += matchStatus.wins;
        totalDraws += matchStatus.draws;
        totalLosses += matchStatus.losses;
      }
      if (awayTeam === id && away) {
        const matchStatus = getMatchStatusAway(homeTeamGoals, awayTeamGoals);
        totalWins += matchStatus.wins;
        totalDraws += matchStatus.draws;
        totalLosses += matchStatus.losses;
      }
    }
  );
  return { totalWins, totalDraws, totalLosses };
};

export const getTotalGoals = (
  id: number,
  data: Matchs[],
  home: boolean,
  away: boolean
) => {
  let goalsFavor = 0;
  let goalsOwn = 0;
  let goalsBalance = 0;
  data.forEach(
    ({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }: Matchs) => {
      if (homeTeam === id && home) {
        goalsFavor += homeTeamGoals;
        goalsOwn += awayTeamGoals;
      }
      if (awayTeam === id && away) {
        goalsFavor += awayTeamGoals;
        goalsOwn += homeTeamGoals;
      }
    }
  );
  goalsBalance = goalsFavor - goalsOwn;
  return { goalsFavor, goalsOwn, goalsBalance };
};
