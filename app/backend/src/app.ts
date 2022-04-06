import * as express from 'express';
import * as cors from 'cors';
import clubsRoute from './routes/clubs.routes';
import loginRoute from './routes/login.routes';
import matchsRoute from './routes/matchs.routes';
import leaderBordRoute from './routes/leaderboard.routes';

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
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(accessControl);
    this.app.use('/', loginRoute, clubsRoute, matchsRoute, leaderBordRoute);
  }
  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Escutando na porta ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
