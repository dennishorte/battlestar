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
    const emptyFields = player.getEmptyFields().filter(f => !f.isVirtualField)
    let count = 0
    for (const field of emptyFields) {
      const space = player.getSpace(field.row, field.col)
      space.crop = 'stone'
      space.cropCount = 1
      count++
    }
    if (count > 0) {
      game.log.add({
        template: '{player} places stone on {count} empty field(s) using {card}',
        args: { player, count, card: this },
      })
    }
  },
}
