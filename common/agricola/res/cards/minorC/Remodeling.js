module.exports = {
  id: "remodeling-c005",
  name: "Remodeling",
  deck: "minorC",
  number: 5,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "You immediately get 1 clay for each clay room and for each major improvement you have.",
  onPlay(game, player) {
    let count = 0
    if (player.roomType === 'clay') {
      count += player.getRoomCount()
    }
    count += (player.majorImprovements || []).length
    if (count > 0) {
      player.addResource('clay', count)
      game.log.add({
        template: '{player} gets {amount} clay from {card}',
        args: { player, amount: count , card: this},
      })
    }
  },
}
