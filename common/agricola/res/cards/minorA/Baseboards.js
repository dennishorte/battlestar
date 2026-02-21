module.exports = {
  id: "baseboards-a004",
  name: "Baseboards",
  deck: "minorA",
  number: 4,
  type: "minor",
  cost: { food: 2, grain: 1 },
  category: "Building Resource Provider",
  text: "You immediately get 1 wood for each room you have. If you have more rooms than people, you get 1 additional wood.",
  onPlay(game, player) {
    const rooms = player.getRoomCount()
    const people = player.familyMembers
    let bonus = rooms
    if (rooms > people) {
      bonus++
    }
    if (bonus > 0) {
      player.addResource('wood', bonus)
      game.log.add({
        template: '{player} gets {amount} wood from {card}',
        args: { player, amount: bonus , card: this},
      })
    }
  },
}
