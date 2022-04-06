import IRating from '../interfaces/Rating';

const tiebreaker = (ratingA: IRating, ratingB: IRating) => {
  if (ratingA.totalVictories !== ratingB.totalVictories) {
    if (ratingA.totalVictories > ratingB.totalVictories) return -1;
    return 1;
  }
  if (ratingA.goalsBalance !== ratingB.goalsBalance) {
    if (ratingA.goalsBalance > ratingB.goalsBalance) return -1;
    return 1;
  }
  if (ratingA.goalsFavor !== ratingB.goalsFavor) {
    if (ratingA.goalsFavor > ratingB.goalsFavor) return -1;
    return 1;
  }
  if (ratingA.goalsOwn > ratingB.goalsOwn) return -1;
  return 1;
};

const orderRatings = (ratingA: IRating, ratingB: IRating) => {
  if (ratingA.totalPoints !== ratingB.totalPoints) {
    if (ratingA.totalPoints > ratingB.totalPoints) return -1;
    return 1;
  }
  const tiebreakerResult = tiebreaker(ratingA, ratingB);
  return tiebreakerResult;
};

export default orderRatings;
