import { Request, Response } from 'express';
import ClubModel from '../database/models/Club';

export const getAllClubs = async (_req: Request, res: Response) => {
  const clubs = await ClubModel.findAll();
  res.status(200).json(clubs);
};

export const getClubById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const club = await ClubModel.findByPk(id);
  res.status(200).json(club);
};
