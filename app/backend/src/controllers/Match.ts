import { Request, Response } from 'express';
import ClubService from '../services/Club';
import MatchService from '../services/Match';

const getMatchs = async (req: Request, res: Response) => {
  const { inProgress } = req.query;
  let matchs;
  if (!inProgress) {
    matchs = await MatchService.getAllMatchs();
    return res.status(matchs.status).json(matchs.data);
  }
  const convertInProgress = (inProgress === 'true');
  matchs = await MatchService.getMatchsByProgress(convertInProgress);
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
    const dataMatch = await MatchService.createMatch({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress });
    return res.status(201).json(dataMatch);
  } catch (error) {
    return res.status(401).json({ message: 'There is no team with such id!' });
  }
};

const finishMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const finishedMatch = await MatchService.finishMatch(id);
  return res.status(200).json(finishedMatch);
};

const editMatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { homeTeamGoals, awayTeamGoals } = req.body;
  if (homeTeamGoals === undefined || awayTeamGoals === undefined) {
    const finishedMatch = await MatchService.finishMatch(id);
    return res.status(200).json(finishedMatch);
  }
  const editedMatch = await MatchService.editMatch(id, { homeTeamGoals, awayTeamGoals });
  return res.status(200).json(editedMatch);
};

const getAllRatings = async (req: Request, res: Response) => {
  const { data } = await ClubService.getAll();
  const ratings = await MatchService.generateRatings(data, true, true);
  return res.status(200).json(ratings);
};

const getHomeRatings = async (req: Request, res: Response) => {
  const { data } = await ClubService.getAll();
  const ratings = await MatchService.generateRatings(data, true, false);
  return res.status(200).json(ratings);
};

const getAwayRatings = async (req: Request, res: Response) => {
  const { data } = await ClubService.getAll();
  const ratings = await MatchService.generateRatings(data, false, true);
  return res.status(200).json(ratings);
};

export default {
  getMatchs,
  saveMatch,
  finishMatch,
  editMatch,
  getAllRatings,
  getHomeRatings,
  getAwayRatings,
};
