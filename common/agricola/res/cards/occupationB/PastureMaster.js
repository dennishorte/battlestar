module.exports = {
  id: "pasture-master-b168",
  name: "Pasture Master",
  deck: "occupationB",
  number: 168,
  type: "occupation",
  players: "4+",
  text: "Each time you renovate, you get 1 additional animal of the respective type in each of your pastures with stable.",
  onRenovate(game, player) {
    for (const pasture of player.farmyard.pastures) {
      // Check if this pasture has a stable
      let hasStable = false
      for (const coord of pasture.spaces) {
        const space = player.getSpace(coord.row, coord.col)
        if (space && space.hasStable) {
          hasStable = true
          break
        }
      }
      if (hasStable && pasture.animalType && player.canPlaceAnimals(pasture.animalType, 1)) {
        game.actions.handleAnimalPlacement(player, { [pasture.animalType]: 1 })
        game.log.add({
          template: '{player} gets 1 {animal} from {card}',
          args: { player, animal: pasture.animalType , card: this},
        })
      }
    }
  },
}
