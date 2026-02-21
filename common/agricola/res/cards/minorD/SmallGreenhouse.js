module.exports = {
  id: "small-greenhouse-d069",
  name: "Small Greenhouse",
  deck: "minorD",
  number: 69,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  prereqs: { occupations: 1 },
  category: "Crop Provider",
  text: "Add 4 and 7 to the current round and place 1 vegetable on each corresponding round space. At the start of these rounds, you can buy the vegetable for 1 food.",
  onPlay(game, player) {
    const currentRound = game.state.round
    for (const offset of [4, 7]) {
      const round = currentRound + offset
      game.scheduleResource(player, 'vegetablesPurchase', round, 1)
    }
    game.log.add({
      template: '{player} schedules vegetables (purchasable for 1 food) from {card}',
      args: { player , card: this},
    })
  },
}
