module.exports = {
  id: "muddy-waters-e041",
  name: "Muddy Waters",
  deck: "minorE",
  number: 41,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { cardsInPlay: 5 },
  text: "Alternate placing 1 food and 1 clay on each remaining even-numbered round space, starting with food. At the start of these rounds, you get the respective good.",
  onPlay(game, player) {
    const currentRound = game.state.round
    let isFood = true
    for (let round = currentRound + 1; round <= 14; round++) {
      if (round % 2 === 0) {
        game.scheduleResource(player, isFood ? 'food' : 'clay', round, 1)
        isFood = !isFood
      }
    }
    game.log.add({
      template: '{player} schedules food and clay from Muddy Waters',
      args: { player },
    })
  },
}
