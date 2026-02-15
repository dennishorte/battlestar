module.exports = {
  id: "basket-carrier-c105",
  name: "Basket Carrier",
  deck: "occupationC",
  number: 105,
  type: "occupation",
  players: "1+",
  text: "Once each harvest, you can buy 1 wood, 1 reed, and 1 grain for 2 food total.",
  onFieldPhaseEnd(game, player) {
    if (player.food >= 2) {
      const selection = game.actions.choose(player, () => [
        'Buy 1 wood, 1 reed, 1 grain for 2 food',
        'Skip',
      ], { title: 'Basket Carrier', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ food: 2 })
        player.addResource('wood', 1)
        player.addResource('reed', 1)
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} buys wood, reed, grain from Basket Carrier',
          args: { player },
        })
      }
    }
  },
}
