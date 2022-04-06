import * as express from 'express';
import { getAllClubs, getClubById } from '../controllers/Club';

const clubsRoute = express.Router();

clubsRoute
  .route('/clubs/:id')
  .get(getClubById);

clubsRoute
  .route('/clubs')
  .get(getAllClubs);

export default clubsRoute;
