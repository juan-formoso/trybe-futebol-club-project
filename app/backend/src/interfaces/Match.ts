import Match from '../database/models/Match';

interface MatchDetail extends Match {
  homeClub: { clubName: string };
  awayClub: { clubName: string };
}

export default MatchDetail;
