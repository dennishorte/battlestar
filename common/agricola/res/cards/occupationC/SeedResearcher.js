module.exports = {
  id: "seed-researcher-c097",
  name: "Seed Researcher",
  deck: "occupationC",
  number: 97,
  type: "occupation",
  players: "1+",
  text: "Each time any people return from both the \"Grain Seeds\" and \"Vegetable Seeds\" action spaces, you get 2 food and you can play 1 occupation, without paying an occupation cost.",
  onReturnHome(game, player) {
    if (game.workersReturnedFrom('take-grain') && game.workersReturnedFrom('take-vegetables')) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Seed Researcher',
        args: { player },
      })
      game.actions.offerFreeOccupation(player, this)
    }
  },
}
