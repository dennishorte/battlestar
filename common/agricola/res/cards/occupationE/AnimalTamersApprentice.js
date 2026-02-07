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
      player.addAnimals('sheep', woodRooms)
      game.log.add({
        template: "{player} gets {count} sheep from Animal Tamer's Apprentice",
        args: { player, count: woodRooms },
      })
    }
    if (clayRooms > 0 && player.canPlaceAnimals('boar', clayRooms)) {
      player.addAnimals('boar', clayRooms)
      game.log.add({
        template: "{player} gets {count} wild boar from Animal Tamer's Apprentice",
        args: { player, count: clayRooms },
      })
    }
    if (stoneRooms > 0 && player.canPlaceAnimals('cattle', stoneRooms)) {
      player.addAnimals('cattle', stoneRooms)
      game.log.add({
        template: "{player} gets {count} cattle from Animal Tamer's Apprentice",
        args: { player, count: stoneRooms },
      })
    }
  },
}
