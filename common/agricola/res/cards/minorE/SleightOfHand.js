module.exports = {
  id: "sleight-of-hand-e078",
  name: "Sleight of Hand",
  deck: "minorE",
  number: 78,
  type: "minor",
  cost: {},
  prereqs: { occupations: 3 },
  text: "When you play this card, you can immediately exchange up to 4 building resources for an equal number of other building resources.",
  onPlay(game, player) {
    game.actions.sleightOfHand(player, this)
  },
}
