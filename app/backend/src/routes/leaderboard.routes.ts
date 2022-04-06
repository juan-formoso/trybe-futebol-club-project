import * as express from 'express';
import leaderBoardAway from '../controllers/AwayTeam';
import leaderBoardHome from '../controllers/HomeTeam';

const leaderBordRoute = express.Router();

leaderBordRoute.route('/leaderboard/home').get(leaderBoardHome);

leaderBordRoute.route('/leaderboard/away').get(leaderBoardAway);

export default leaderBordRoute;
