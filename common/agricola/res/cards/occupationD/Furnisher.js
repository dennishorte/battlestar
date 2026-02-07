module.exports = {
  id: "furnisher-d096",
  name: "Furnisher",
  deck: "occupationD",
  number: 96,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 2 wood. After each new room you build, you can build or play 1 improvement for 1 wood less.",
  onPlay(game, player) {
    player.addResource('wood', 2)
    game.log.add({
      template: '{player} gets 2 wood from Furnisher',
      args: { player },
    })
  },
  onBuildRoom(game, player) {
    player.furnisherDiscount = true
    game.log.add({
      template: '{player} can play an improvement for 1 wood less via Furnisher',
      args: { player },
    })
  },
  modifyImprovementCost(player, cost) {
    if (player.furnisherDiscount && cost.wood && cost.wood > 0) {
      player.furnisherDiscount = false
      return { ...cost, wood: cost.wood - 1 }
    }
    return cost
  },
}
