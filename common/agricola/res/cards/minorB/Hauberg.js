module.exports = {
  id: "hauberg-b041",
  name: "Hauberg",
  deck: "minorB",
  number: 41,
  type: "minor",
  cost: { food: 3 },
  prereqs: { occupations: 3 },
  category: "Building Resource Provider",
  text: "Alternate placing 2 wood and 1 wild boar on the next 4 round spaces. You decide what to start with. At the start of these rounds, you get the goods.",
  onPlay(game, player) {
    game.actions.offerHauberg(player, this)
  },
}
