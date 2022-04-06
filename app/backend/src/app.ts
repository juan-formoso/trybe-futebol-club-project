import * as express from 'express';
import * as cors from 'cors';
import ClubController from './controllers/Club';
import MatchController from './controllers/Match';
import { login, validate } from './controllers/User';
import validation from './middlewares/loginValidation';
import checkToken from './middlewares/Token';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.config();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
    this.routes();
  }

  private routes():void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.post('/login', validation.validLogin, login);
    this.app.get('/login/validate', validate);
    this.app.get('/clubs', ClubController.getAllClubs);
    this.app.get('/clubs/:id', ClubController.getClubById);
    this.app.get('/matchs', MatchController.getMatchs);
    this.app.post('/matchs', checkToken, MatchController.saveMatch);
    this.app.patch('/matchs/:id/finish', checkToken, MatchController.finishMatch);
    this.app.patch('/matchs/:id', checkToken, MatchController.editMatch);
    this.app.get('/leaderboard', MatchController.getAllRatings);
    this.app.get('/leaderboard/home', MatchController.getHomeRatings);
    this.app.get('/leaderboard/away', MatchController.getAwayRatings);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Escutando na porta ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
