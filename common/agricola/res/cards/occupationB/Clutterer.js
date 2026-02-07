module.exports = {
  id: "clutterer-b100",
  name: "Clutterer",
  deck: "occupationB",
  number: 100,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each card played after this one that has \"accumulation space(s)\" in its text.",
  getEndGamePoints(player) {
    return player.getCardsWithTextPlayedAfter(this.id, 'accumulation space')
  },
}
