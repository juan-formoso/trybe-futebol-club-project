import { Request, Response, NextFunction } from 'express';
import ClubModel from '../database/models/Club';

const matchValidate = async (req: Request, res: Response, next: NextFunction) => {
  const { homeTeam, awayTeam } = req.body;
  if (homeTeam === awayTeam) {
    return res.status(401).json({
      message: 'It is not possible to create a match with two equal teams',
    });
  }
  const homeClubExist = await ClubModel.findByPk(homeTeam);
  const awayClubExist = await ClubModel.findByPk(awayTeam);
  if (!homeClubExist || !awayClubExist) {
    return res.status(401).json({ message: 'There is no team with such id!' });
  }
  next();
};

export default matchValidate;
