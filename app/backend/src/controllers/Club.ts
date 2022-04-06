import { Request, Response } from 'express';
import ClubService from '../services/Club';

const getAllClubs = async (_req: Request, res: Response) => {
  const { status, data } = await ClubService.getAll();
  return res.status(status).json(data);
};

const getClubById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, data } = await ClubService.getById(id);
  return res.status(status).json(data);
};

export default { getAllClubs, getClubById };
