const MAX_STABLES = 4

module.exports = {
  id: "open-air-farmer-b149",
  name: "Open Air Farmer",
  deck: "occupationB",
  number: 149,
  type: "occupation",
  players: "3+",
  text: "When you play this card, if you have at least 3 stables in your supply, remove 3 stables in your supply from play and build a pasture covering 2 farmyard spaces. You only need to pay a total of 2 wood for the fences.",
  onPlay(game, player) {
    const stablesInSupply = MAX_STABLES - player.getStableCount() - (player.removedStables || 0)
    if (stablesInSupply < 3 || player.wood < 2) {
      return
    }

    const fenceableSpaces = player.getFenceableSpaces()
    // Need at least 2 adjacent fenceable spaces
    if (fenceableSpaces.length < 2) {
      return
    }

    const response = game.actions.choose(player, ['Cancel'], {
      title: 'Open Air Farmer: select 2 spaces for pasture',
      min: 1,
      max: 1,
      allowsAction: 'build-pasture',
      fenceableSpaces,
    })

    if (response.action === 'build-pasture' && response.spaces && response.spaces.length === 2) {
      const selectedSpaces = response.spaces
      const validation = player.validatePastureSelection(selectedSpaces, { skipCostCheck: true })
      if (!validation.valid) {
        return
      }

      // Pay 2 wood for fences (discounted from normal cost)
      player.payCost({ wood: 2 })

      // Build the pasture (bypass normal fence cost — already paid 2 wood)
      player.buildPasture(selectedSpaces, { skipCost: true })

      // Remove 3 stables from supply
      player.removedStables = (player.removedStables || 0) + 3

      game.log.add({
        template: '{player} builds a pasture via {card} and removes 3 stables from supply',
        args: { player , card: this},
      })
    }
  },
}
