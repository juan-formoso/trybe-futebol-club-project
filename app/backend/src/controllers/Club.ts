import { Request, Response } from 'express';
import ClubServices from '../services/Club';

const getAll = async (req: Request, res: Response) => {
  const clubs = await ClubServices.getAll();
  res.json(clubs);
};

const getById = async (req: Request, res: Response) => {
  const club = await ClubServices.getById(req.params.id);
  res.json(club);
};

export default {
  getAll,
  getById,
};
