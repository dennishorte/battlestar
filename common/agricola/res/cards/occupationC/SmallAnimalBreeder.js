module.exports = {
  id: "small-animal-breeder-c111",
  name: "Small Animal Breeder",
  deck: "occupationC",
  number: 111,
  type: "occupation",
  players: "1+",
  text: "Before the start of each round, if you have food equal to or higher than the current round number, you get 1 food.",
  onBeforeRoundStart(game, player) {
    if (player.food >= game.state.round) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Small Animal Breeder',
        args: { player },
      })
    }
  },
}
