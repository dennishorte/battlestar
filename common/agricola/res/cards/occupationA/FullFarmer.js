module.exports = {
  id: "full-farmer-a134",
  name: "Full Farmer",
  deck: "occupationA",
  number: 134,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you immediately get 1 wood and 1 clay. During scoring, you get 1 bonus point for each pasture you have holding the maximum number of animals.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    player.addResource('clay', 1)
    game.log.add({
      template: '{player} gets 1 wood and 1 clay from Full Farmer',
      args: { player },
    })
  },
  getEndGamePoints(player) {
    return player.getFullPastureCount()
  },
}
