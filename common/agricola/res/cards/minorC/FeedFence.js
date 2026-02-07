module.exports = {
  id: "feed-fence-c056",
  name: "Feed Fence",
  deck: "minorC",
  number: 56,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "For each new stable you build, you get 1 food - for your last one, get 3 food. Each time you build stables, you can build exactly 1 stable for 1 clay instead of wood.",
  allowsClayStable: true,
  onBuildStable(game, player, isLastStable) {
    const food = isLastStable ? 3 : 1
    player.addResource('food', food)
    game.log.add({
      template: '{player} gets {amount} food from Feed Fence',
      args: { player, amount: food },
    })
  },
}
