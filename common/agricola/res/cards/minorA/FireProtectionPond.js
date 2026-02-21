module.exports = {
  id: "fire-protection-pond-a045",
  name: "Fire Protection Pond",
  deck: "minorA",
  number: 45,
  type: "minor",
  cost: { food: 1 },
  prereqs: { houseType: "wood" },
  category: "Food Provider",
  text: "Once you no longer live in a wooden house, place 1 food on each of the next 6 round spaces. At the start of these rounds, you get the food.",
  onRenovate(game, player, fromType, _toType) {
    if (fromType === 'wood') {
      const currentRound = game.state.round
      for (let i = 1; i <= 6; i++) {
        const round = currentRound + i
        game.scheduleResource(player, 'food', round, 1)
      }
      game.log.add({
        template: '{player} schedules food from {card}',
        args: { player , card: this},
      })
    }
  },
}
