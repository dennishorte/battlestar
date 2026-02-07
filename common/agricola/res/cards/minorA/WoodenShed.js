module.exports = {
  id: "wooden-shed-a010",
  name: "Wooden Shed",
  deck: "minorA",
  number: 10,
  type: "minor",
  cost: { wood: 2, reed: 1 },
  vps: 0,
  prereqs: { houseType: "wood" },
  category: "Farm Planner",
  text: "This card can only be played via a \"Major Improvement\" action. It provides room for one person. You may no longer renovate.",
  requiresMajorImprovementAction: true,
  providesRoom: true,
  onPlay(game, player) {
    player.cannotRenovate = true
    game.log.add({
      template: '{player} can no longer renovate (Wooden Shed)',
      args: { player },
    })
  },
}
