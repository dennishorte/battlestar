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
    if (unoccupiedRound1to4.length !== 1) {
      return
    }
    const actionId = unoccupiedRound1to4[0]
    const action = game.getActionById(actionId)
    const spaceName = action ? action.name : actionId
    const cardName = 'Minstrel'
    const choice = game.actions.choose(player, [`Use ${spaceName}`, 'Skip'], {
      title: `${cardName}: Use the single unoccupied space (rounds 1–4)?`,
      min: 1,
      max: 1,
    })
    if (choice[0] === 'Skip') {
      return
    }
    game.actions.executeAction(player, actionId)
  },
}
