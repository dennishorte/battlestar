module.exports = {
  id: "shaving-horse-a048",
  name: "Shaving Horse",
  deck: "minorA",
  number: 48,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "Each time after you obtain at least 1 wood, if you then have 5 or more wood in your supply, you can exchange 1 wood for 3 food. With 7 or more wood, you must do so.",
  onGainWood(game, player) {
    if (player.wood >= 7) {
      player.payCost({ wood: 1 })
      player.addResource('food', 3)
      game.log.add({
        template: '{player} must exchange 1 wood for 3 food from Shaving Horse',
        args: { player },
      })
    }
    else if (player.wood >= 5) {
      game.actions.offerShavingHorse(player, this)
    }
  },
}
