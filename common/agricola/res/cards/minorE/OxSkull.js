module.exports = {
  id: "ox-skull-e037",
  name: "Ox Skull",
  deck: "minorE",
  number: 37,
  type: "minor",
  cost: {},
  prereqs: { cattle: 1 },
  text: "When you play this card, you immediately get 1 food. During scoring, if you have no cattle, you get 3 bonus points.",
  onPlay(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Ox Skull',
      args: { player },
    })
  },
  getEndGamePoints(player) {
    return player.getAnimalCount('cattle') === 0 ? 3 : 0
  },
}
