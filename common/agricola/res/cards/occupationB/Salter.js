module.exports = {
  id: "salter-b157",
  name: "Salter",
  deck: "occupationB",
  number: 157,
  type: "occupation",
  players: "4+",
  text: "At any time, you can pay 1 sheep/wild boar/cattle from your farmyard. If you do, place 1 food on each of the next 3/5/7 round spaces. At the start of these rounds, you get the food.",
  allowsAnytimeAction: true,
  anytimeAction(game, player, animalType) {
    const roundsMap = { sheep: 3, boar: 5, cattle: 7 }
    const rounds = roundsMap[animalType]
    if (rounds) {
      const currentRound = game.state.round
      for (let i = 1; i <= rounds; i++) {
        const round = currentRound + i
        game.scheduleResource(player, 'food', round, 1)
      }
    }
  },
}
