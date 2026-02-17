module.exports = {
  id: "cube-cutter-c098",
  name: "Cube Cutter",
  deck: "occupationC",
  number: 98,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 wood. In the field phase of each harvest, you can use this card to exchange exactly 1 wood and 1 food for 1 bonus point.",
  onPlay(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Cube Cutter',
      args: { player },
    })
  },
  onFieldPhase(game, player) {
    if (player.wood >= 1 && player.food >= 1) {
      const selection = game.actions.choose(player, () => [
        'Exchange 1 wood and 1 food for 1 bonus point',
        'Skip',
      ], { title: 'Cube Cutter', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 1, food: 1 })
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} exchanges 1 wood and 1 food for 1 BP via Cube Cutter',
          args: { player },
        })
      }
    }
  },
}
