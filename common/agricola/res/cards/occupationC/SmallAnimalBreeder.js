module.exports = {
  id: "small-animal-breeder-c111",
  name: "Small Animal Breeder",
  deck: "occupationC",
  number: 111,
  type: "occupation",
  players: "1+",
  text: "Before the start of each round, if you have food equal to or higher than the current round number, you get 1 food.",
  matches_onRoundStart(game, player) {
    return player.food >= game.state.round
  },
  onRoundStart(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from {card}',
      args: { player , card: this},
    })
  },
}
