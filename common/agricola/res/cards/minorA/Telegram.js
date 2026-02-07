module.exports = {
  id: "telegram-a022",
  name: "Telegram",
  deck: "minorA",
  number: 22,
  type: "minor",
  cost: { food: 2 },
  vps: 1,
  prereqs: { fencesInSupply: 1 },
  category: "Actions Booster",
  text: "Add 1 to the current round for each fence in your supply and mark the corresponding round space. In that round only, you can place a person from your supply.",
  onPlay(game, player) {
    const fences = player.getFencesInSupply()
    const targetRound = game.state.round + fences
    if (targetRound <= 14) {
      if (!game.state.telegramRounds) {
        game.state.telegramRounds = {}
      }
      game.state.telegramRounds[player.name] = targetRound
      game.log.add({
        template: '{player} schedules a temporary worker for round {round} via Telegram',
        args: { player, round: targetRound },
      })
    }
  },
}
