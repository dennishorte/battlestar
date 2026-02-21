module.exports = {
  id: "estate-master-b132",
  name: "Estate Master",
  deck: "occupationB",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "Once you have no unused farmyard spaces left, you get 1 bonus point for each vegetable that you harvest.",
  onHarvestVegetables(game, player, count) {
    if (player.getUnusedSpaceCount() === 0) {
      player.addBonusPoints(count)
      game.log.add({
        template: '{player} gets {amount} bonus points from {card}',
        args: { player, amount: count , card: this},
      })
    }
  },
}
