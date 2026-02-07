module.exports = {
  id: "work-certificate-a082",
  name: "Work Certificate",
  deck: "minorA",
  number: 82,
  type: "minor",
  cost: {},
  prereqs: { occupations: 3 },
  category: "Building Resource Provider",
  text: "Each time after you use an action space, you can take 1 building resource from a building resource accumulation space with at least 4 building resources on it.",
  onAction(game, player) {
    game.actions.offerWorkCertificate(player, this)
  },
}
