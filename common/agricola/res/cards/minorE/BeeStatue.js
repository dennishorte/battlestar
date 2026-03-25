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
  matches_afterPlayerAction(_game, _player, actionId) {
    return actionId === 'day-laborer'
  },
  afterPlayerAction(game, player, _actionId) {
    const s = game.cardState(this.id)
    if (s.stack && s.stack.length > 0) {
      const resource = s.stack.pop()
      player.addResource(resource, 1)
      game.log.add({
        template: '{player} gets 1 {resource}',
        args: { player, resource },
      })
    }
  },
}
