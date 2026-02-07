module.exports = {
  id: "earthenware-potter-d099",
  name: "Earthenware Potter",
  deck: "occupationD",
  number: 99,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 4 or before, after the final harvest, you get 1 bonus point for each person for which you then pay 1 clay.",
  onPlay(game, _player) {
    this.playedEarly = game.state.round <= 4
  },
  onAfterFinalHarvest(game, player) {
    if (this.playedEarly) {
      game.actions.offerEarthenwarePotterBonus(player, this)
    }
  },
}
