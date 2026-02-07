module.exports = {
  id: "pasture-master-b168",
  name: "Pasture Master",
  deck: "occupationB",
  number: 168,
  type: "occupation",
  players: "4+",
  text: "Each time you renovate, you get 1 additional animal of the respective type in each of your pastures with stable.",
  onRenovate(game, player) {
    const pasturesWithStable = player.getPasturesWithStable()
    for (const pasture of pasturesWithStable) {
      if (pasture.animalType && player.canPlaceAnimals(pasture.animalType, 1)) {
        player.addAnimals(pasture.animalType, 1)
        game.log.add({
          template: '{player} gets 1 {animal} from Pasture Master',
          args: { player, animal: pasture.animalType },
        })
      }
    }
  },
}
