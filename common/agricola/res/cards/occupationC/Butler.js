module.exports = {
  id: "butler-c100",
  name: "Butler",
  deck: "occupationC",
  number: 100,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 11 or before, during scoring, you get 4 bonus points if you then have more rooms than people.",
  onPlay(game, _player) {
    this.playedEarly = game.state.round <= 11
  },
  getEndGamePoints(player) {
    if (this.playedEarly && player.getRoomCount() > player.getFamilySize()) {
      return 4
    }
    return 0
  },
}
