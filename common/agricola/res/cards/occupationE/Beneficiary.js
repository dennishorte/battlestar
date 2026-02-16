module.exports = {
  id: "beneficiary-e097",
  name: "Beneficiary",
  deck: "occupationE",
  number: 97,
  type: "occupation",
  players: "1+",
  text: "If this is your 3rd occupation, you can immediately play another occupation for an occupation cost of 1 food and/or play 1 minor improvement by paying its cost.",
  onPlay(game, player) {
    if (player.getOccupationCount() === 3) {
      game.actions.offerPlayOccupation(player, this, { cost: { food: 1 } })
      game.actions.buyMinorImprovement(player)
    }
  },
}
