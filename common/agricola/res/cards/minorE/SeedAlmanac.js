module.exports = {
  id: "seed-almanac-e018",
  name: "Seed Almanac",
  deck: "minorE",
  number: 18,
  type: "minor",
  cost: { reed: 1 },
  prereqs: { occupations: 4 },
  text: "Each time after you play a minor improvement after this one, you can pay 1 food to plow 1 field.",
  onPlayMinor(game, player, card) {
    if (card.id !== this.id && player.food >= 1) {
      game.actions.offerPlowForFood(player, this)
    }
  },
}
