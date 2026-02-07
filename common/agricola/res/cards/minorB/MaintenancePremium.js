module.exports = {
  id: "maintenance-premium-b055",
  name: "Maintenance Premium",
  deck: "minorB",
  number: 55,
  type: "minor",
  cost: {},
  prereqs: { occupations: 2 },
  category: "Food Provider",
  text: "Place 3 food on this card. Each time you use a wood accumulation space, you get 1 food from this card. Each time you renovate, restock this card to 3 food.",
  onPlay(game, player) {
    player.maintenancePremiumFood = 3
    game.log.add({
      template: '{player} places 3 food on Maintenance Premium',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
      if (player.maintenancePremiumFood > 0) {
        player.maintenancePremiumFood--
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Maintenance Premium ({remaining} remaining)',
          args: { player, remaining: player.maintenancePremiumFood },
        })
      }
    }
  },
  onRenovate(game, player) {
    player.maintenancePremiumFood = 3
    game.log.add({
      template: '{player} restocks Maintenance Premium to 3 food',
      args: { player },
    })
  },
}
