module.exports = {
  id: "cottar-e122",
  name: "Cottar",
  deck: "occupationE",
  number: 122,
  type: "occupation",
  players: "1+",
  text: "Each time you play or build an improvement, you get your choice of 1 wood or 1 clay immediately after paying its cost.",
  onBuildImprovement(game, player) {
    const selection = game.actions.choose(player, ['Take 1 wood', 'Take 1 clay'], {
      title: 'Cottar: Choose resource',
      min: 1,
      max: 1,
    })
    const resource = selection[0].includes('wood') ? 'wood' : 'clay'
    player.addResource(resource, 1)
    game.log.add({
      template: '{player} gets 1 {resource} from Cottar',
      args: { player, resource },
    })
  },
}
