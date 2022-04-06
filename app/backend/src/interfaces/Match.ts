interface IMatch {
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean,
  homeClub?: {
    clubName: string
  },
  awayClub?: {
    clubName: string
  }
}

export default IMatch;
