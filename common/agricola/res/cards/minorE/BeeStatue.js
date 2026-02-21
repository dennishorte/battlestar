module.exports = {
  id: "bee-statue-e040",
  name: "Bee Statue",
  deck: "minorE",
  number: 40,
  type: "minor",
  cost: { clay: 2 },
  text: "Pile (from bottom to top) 1 vegetable, 1 stone, 1 grain, 1 stone, 1 grain on this card. Each time you use the \"Day Laborer\" action space, you get the top good.",
  onPlay(game, _player) {
    // Stack: bottom [veg, stone, grain, stone, grain] top
    game.cardState(this.id).stack = ['vegetables', 'stone', 'grain', 'stone', 'grain']
  },
  afterPlayerAction(game, player, actionId) {
    const s = game.cardState(this.id)
    if (actionId === 'day-laborer' && s.stack && s.stack.length > 0) {
      const resource = s.stack.pop()
      player.addResource(resource, 1)
      game.log.add({
        template: '{player} gets 1 {resource} from {card}',
        args: { player, resource , card: this},
      })
    }
  },
}
