module.exports = {
  id: "basket-carrier-c105",
  name: "Basket Carrier",
  deck: "occupationC",
  number: 105,
  type: "occupation",
  players: "1+",
  text: "Once each harvest, you can buy 1 wood, 1 reed, and 1 grain for 2 food total.",
  onHarvest(game, player) {
    if (player.food >= 2) {
      game.actions.offerBasketCarrierPurchase(player, this)
    }
  },
}
