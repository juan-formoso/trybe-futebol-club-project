import { Request, Response } from 'express';
import ClubServices from '../services/Club';
import MatchServices from '../services/Match';

const getMatchs = async (req: Request, res: Response) => {
  const { inProgress } = req.query;
  if (!inProgress) {
    const allMatchs = await MatchServices.getAll();
    return res.status(allMatchs.status).json(allMatchs.data);
  }
  const convertInProgress = (inProgress === 'true');
  const matchs = await MatchServices.getByProgress(convertInProgress);
  return res.status(matchs.status).json(matchs.data);
};

const saveMatch = async (req: Request, res: Response) => {
  const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress } = req.body;
  if (homeTeam === awayTeam) {
    return res.status(401).json({ 
      message: 'It is not possible to create a match with two equal teams',
    });
  }
  try {
    const matchData = await MatchServices.startMatch({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress,
    });
    return res.status(201).json(matchData);
  } catch (error) {
    return res.status(401).json({ message: 'There is no team with such id!' });
  }
};

const endMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const finishedMatch = await MatchServices.endMatch(id);
  return res.status(200).json(finishedMatch);
};

const modifyMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { homeTeamGoals, awayTeamGoals } = req.body;
  if (homeTeamGoals === undefined || awayTeamGoals === undefined) {
    const finishedMatch = await MatchServices.endMatch(id);
    return res.status(200).json(finishedMatch);
  }
  const editedMatch = await MatchServices.modifyMatch(
    id, 
    { 
      homeTeamGoals, 
      awayTeamGoals,
    },
  );
  return res.status(200).json(editedMatch);
};

const getAllRatings = async (_req: Request, res: Response) => {
  const { data } = await ClubServices.getAll();
  const ratings = await MatchServices.generateRating(data, true, true);
  return res.status(200).json(ratings);
};

const getHomeRatings = async (_req: Request, res: Response) => {
  const { data } = await ClubServices.getAll();
  const ratings = await MatchServices.generateRating(data, true, false);
  return res.status(200).json(ratings);
};

const getAwayRatings = async (_req: Request, res: Response) => {
  const { data } = await ClubServices.getAll();
  const ratings = await MatchServices.generateRating(data, false, true);
  return res.status(200).json(ratings);
};

export default {
  getMatchs,
  saveMatch,
  endMatch,
  modifyMatch,
  getAllRatings,
  getHomeRatings,
  getAwayRatings,
};
