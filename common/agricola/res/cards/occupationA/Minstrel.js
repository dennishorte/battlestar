module.exports = {
  id: "minstrel-a151",
  name: "Minstrel",
  deck: "occupationA",
  number: 151,
  type: "occupation",
  players: "3+",
  text: "At the start of each returning home phase, if only one action space card on round space 1 to 4 is unoccupied, you can use that action space.",
  onReturnHomeStart(game, player) {
    const unoccupiedRound1to4 = game.getUnoccupiedActionSpacesInRounds(1, 4)
    if (unoccupiedRound1to4.length === 1) {
      game.actions.offerUseActionSpace(player, this, unoccupiedRound1to4[0])
    }
  },
}
