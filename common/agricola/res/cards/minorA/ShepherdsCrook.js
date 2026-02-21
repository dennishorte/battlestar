module.exports = {
  id: "shepherds-crook-a083",
  name: "Shepherd's Crook",
  deck: "minorA",
  number: 83,
  type: "minor",
  cost: { wood: 1 },
  category: "Livestock Provider",
  text: "Each time you fence a new pasture covering at least 4 farmyard spaces, you immediately get 2 sheep on this pasture.",
  onBuildPasture(game, player, pasture) {
    if (pasture.spaces.length >= 4) {
      if (player.canPlaceAnimals('sheep', 2)) {
        player.addAnimals('sheep', 2)
        game.log.add({
          template: '{player} gets 2 sheep from {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
