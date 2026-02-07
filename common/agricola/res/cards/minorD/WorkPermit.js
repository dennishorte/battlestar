module.exports = {
  id: "work-permit-d022",
  name: "Work Permit",
  deck: "minorD",
  number: 22,
  type: "minor",
  cost: { food: 1 },
  prereqs: { buildingResourcesInSupply: 1 },
  category: "Actions Booster",
  text: "Add 1 to the current round for each building resource you have and place 1 person from your supply on the corresponding round space. In that round, you can use the person.",
  onPlay(game, player) {
    const buildingResources = player.wood + player.clay + player.reed + player.stone
    const targetRound = game.state.round + buildingResources
    if (targetRound <= 14 && player.hasPersonInSupply()) {
      game.actions.scheduleWorkPermitPerson(player, this, targetRound)
    }
  },
}
