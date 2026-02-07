module.exports = {
  id: "bee-statue-e040",
  name: "Bee Statue",
  deck: "minorE",
  number: 40,
  type: "minor",
  cost: { clay: 2 },
  text: "Pile (from bottom to top) 1 vegetable, 1 stone, 1 grain, 1 stone, 1 grain on this card. Each time you use the \"Day Laborer\" action space, you get the top good.",
  onPlay(_game, _player) {
    // Stack: bottom [veg, stone, grain, stone, grain] top
    this.stack = ['vegetables', 'stone', 'grain', 'stone', 'grain']
  },
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer' && this.stack && this.stack.length > 0) {
      const resource = this.stack.pop()
      player.addResource(resource, 1)
      game.log.add({
        template: '{player} gets 1 {resource} from Bee Statue',
        args: { player, resource },
      })
    }
  },
}
