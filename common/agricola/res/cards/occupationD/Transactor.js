module.exports = {
  id: "transactor-d098",
  name: "Transactor",
  deck: "occupationD",
  number: 98,
  type: "occupation",
  players: "1+",
  text: "Immediately before the final harvest at the end of round 14, you can take all the building resources that are left on the entire game board.",
  onBeforeFinalHarvest(game, player) {
    const collected = { wood: 0, clay: 0, reed: 0, stone: 0 }
    for (const [actionId, state] of Object.entries(game.state.actionSpaces)) {
      if (!state || !state.accumulated) {
        continue
      }
      const action = game.getActionById(actionId)
      if (!action || !action.accumulates) {
        continue
      }
      for (const [resource, perRound] of Object.entries(action.accumulates)) {
        if (collected[resource] !== undefined) {
          collected[resource] += state.accumulated * perRound
        }
      }
    }
    let any = false
    for (const [resource, amount] of Object.entries(collected)) {
      if (amount > 0) {
        player.addResource(resource, amount)
        any = true
      }
    }
    if (any) {
      game.log.add({
        template: '{player} collects building resources from the board (Transactor): {wood} wood, {clay} clay, {reed} reed, {stone} stone',
        args: { player, ...collected },
      })
    }
  },
}
