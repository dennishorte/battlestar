module.exports = {
  id: "breeder-buyer-a167",
  name: "Breeder Buyer",
  deck: "occupationA",
  number: 167,
  type: "occupation",
  players: "4+",
  text: "Each time you build at least 1 wood/clay/stone room and at least 1 stable on the same turn, you also get 1 sheep/wild boar/cattle.",
  onBuildRoomAndStable(game, player, roomType) {
    const animalMap = { wood: 'sheep', clay: 'boar', stone: 'cattle' }
    const animal = animalMap[roomType]
    if (animal && player.canPlaceAnimals(animal, 1)) {
      player.addAnimals(animal, 1)
      game.log.add({
        template: '{player} gets 1 {animal} from Breeder Buyer',
        args: { player, animal },
      })
    }
  },
}
