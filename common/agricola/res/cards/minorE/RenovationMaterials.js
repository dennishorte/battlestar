module.exports = {
  id: "renovation-materials-e002",
  name: "Renovation Materials",
  deck: "minorE",
  number: 2,
  type: "minor",
  cost: { clay: 3, reed: 1 },
  prereqs: { houseType: "wood" },
  text: "Immediately renovate to clay at no cost.",
  onPlay(game, player) {
    game.actions.freeRenovation(player, { card: this, targetType: 'clay' })
  },
}
