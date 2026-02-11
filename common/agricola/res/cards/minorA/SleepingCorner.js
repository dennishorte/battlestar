module.exports = {
  id: "sleeping-corner-a026",
  name: "Sleeping Corner",
  deck: "minorA",
  number: 26,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { grainFields: 2 },
  category: "Actions Booster",
  text: "You can use any \"Wish for Children\" action space even if it is occupied by one other player's person.",
  allowOccupiedFamilyGrowth: true,
  canUseOccupiedActionSpace(game, player, actionId, action, state) {
    return action.allowsFamilyGrowth && state.occupiedBy !== player.name
  },
}
