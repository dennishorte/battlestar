module.exports = {
  id: "acquirer-e102",
  name: "Acquirer",
  deck: "occupationE",
  number: 102,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you may pay food equal to the number of people you have to buy 1 good of your choice from the general supply.",
  onRoundStart(game, player) {
    const cost = player.getFamilySize()
    if (player.food >= cost) {
      game.actions.offerAcquirerPurchase(player, this, cost)
    }
  },
}
