import Match from '../database/models/Match';

interface IMatch {
  homeClub: {
    clubName: string;
  }
  awayClub: {
    clubName: string;
  }
}

export default IMatch;
