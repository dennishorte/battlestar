module.exports = {
  id: "animal-tamers-apprentice-e168",
  name: "Animal Tamer's Apprentice",
  deck: "occupationE",
  number: 168,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you get 1 sheep/wild boar/cattle for each unoccupied wood/clay/stone room in your house.",
  onRoundStart(game, player) {
    const woodRooms = player.getUnoccupiedRoomsByType('wood')
    const clayRooms = player.getUnoccupiedRoomsByType('clay')
    const stoneRooms = player.getUnoccupiedRoomsByType('stone')

    if (woodRooms > 0 && player.canPlaceAnimals('sheep', woodRooms)) {
      game.actions.handleAnimalPlacement(player, { sheep: woodRooms })
      game.log.add({
        template: '{player} gets {count} sheep from {card}',
        args: { player, count: woodRooms, card: this },
      })
    }
    if (clayRooms > 0 && player.canPlaceAnimals('boar', clayRooms)) {
      game.actions.handleAnimalPlacement(player, { boar: clayRooms })
      game.log.add({
        template: '{player} gets {count} wild boar from {card}',
        args: { player, count: clayRooms, card: this },
      })
    }
    if (stoneRooms > 0 && player.canPlaceAnimals('cattle', stoneRooms)) {
      game.actions.handleAnimalPlacement(player, { cattle: stoneRooms })
      game.log.add({
        template: '{player} gets {count} cattle from {card}',
        args: { player, count: stoneRooms, card: this },
      })
    }
  },
}
