module.exports = {
  id: "mantlepiece-b033",
  name: "Mantlepiece",
  deck: "minorB",
  number: 33,
  type: "minor",
  cost: { stone: 1 },
  vps: -3,
  prereqs: {
    houseType: ["clay", "stone"],
  },
  category: "Points Provider",
  text: "When you play this card, you immediately get 1 bonus point for each complete round left to play. You may no longer renovate your house.",
  onPlay(game, player) {
    const roundsLeft = 14 - game.state.round
    if (roundsLeft > 0) {
      player.addBonusPoints(roundsLeft)
      game.log.add({
        template: '{player} gets {points} bonus points from {card}',
        args: { player, points: roundsLeft , card: this},
      })
    }
    player.cannotRenovate = true
  },
}
