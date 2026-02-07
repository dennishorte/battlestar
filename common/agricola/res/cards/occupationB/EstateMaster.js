module.exports = {
  id: "estate-master-b132",
  name: "Estate Master",
  deck: "occupationB",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "Once you have no unused farmyard spaces left, you get 1 bonus point for each vegetable that you harvest.",
  onHarvestVegetable(game, player, count) {
    if (player.getUnusedSpaces() === 0) {
      player.bonusPoints = (player.bonusPoints || 0) + count
      game.log.add({
        template: '{player} gets {amount} bonus points from Estate Master',
        args: { player, amount: count },
      })
    }
  },
}
