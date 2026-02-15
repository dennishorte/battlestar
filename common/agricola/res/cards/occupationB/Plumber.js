module.exports = {
  id: "plumber-b128",
  name: "Plumber",
  deck: "occupationB",
  number: 128,
  type: "occupation",
  players: "1+",
  text: "Each time after you use the \"Major Improvement\" action space, you can take a \"Renovation\" action for 2 clay or 2 stone less.",
  modifyRenovationCost(game, player, cost) {
    if (!player._plumberActive) {
      return cost
    }
    const newCost = { ...cost }
    if (newCost.clay) {
      newCost.clay = Math.max(0, newCost.clay - 2)
    }
    if (newCost.stone) {
      newCost.stone = Math.max(0, newCost.stone - 2)
    }
    return newCost
  },
  onAction(game, player, actionId) {
    if (actionId === 'major-minor-improvement') {
      // Temporarily activate discount to check if renovation is possible
      player._plumberActive = true
      const canReno = player.canRenovate()
      player._plumberActive = false

      if (canReno) {
        const choices = ['Renovate (discounted)', 'Skip']
        const selection = game.actions.choose(player, choices, {
          title: 'Plumber: Renovate for 2 clay/stone less?',
          min: 1,
          max: 1,
        })
        if (selection[0] !== 'Skip') {
          player._plumberActive = true
          game.actions.renovate(player)
          player._plumberActive = false
        }
      }
    }
  },
}
