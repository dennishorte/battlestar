module.exports = {
  id: "petrified-wood-d006",
  name: "Petrified Wood",
  deck: "minorD",
  number: 6,
  type: "minor",
  cost: {},
  prereqs: { occupations: 2 },
  category: "Building Resource Provider",
  text: "Immediately exchange up to 3 wood for 1 stone each.",
  onPlay(game, player) {
    game.actions.petrifiedWoodExchange(player, this)
  },
}
