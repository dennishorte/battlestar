module.exports = {
  id: "stone-clearing-c006",
  name: "Stone Clearing",
  deck: "minorC",
  number: 6,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "Immediately place 1 stone on each of your empty fields. Harvest them during the next field phase. These fields are considered planted until then.",
  onPlay(game, player) {
    game.actions.stoneClearingEffect(player, this)
  },
}
