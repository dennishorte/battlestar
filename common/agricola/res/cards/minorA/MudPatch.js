module.exports = {
  id: "mud-patch-a011",
  name: "Mud Patch",
  deck: "minorA",
  number: 11,
  type: "minor",
  cost: {},
  category: "Livestock Provider",
  text: "When you play this card, you immediately get 1 wild boar. You can hold 1 wild boar on each of your unplanted field tiles.",
  holdsAnimals: { boar: true },
  onPlay(game, player) {
    if (player.canPlaceAnimals('boar', 1)) {
      game.actions.handleAnimalPlacement(player, { boar: 1 })
      game.log.add({
        template: '{player} gets 1 wild boar from {card}',
        args: { player , card: this},
      })
    }
  },
  getAnimalCapacity(_game, player) {
    return player.getFieldSpaces().filter(f => !f.crop || f.cropCount === 0).length
  },
  matches_onFieldSown(_game, player) {
    return (player.getCardAnimals(this.id).boar || 0) > this.getAnimalCapacity(_game, player)
  },
  onFieldSown(game, player) {
    const excess = (player.getCardAnimals(this.id).boar || 0) - this.getAnimalCapacity(game, player)
    if (excess <= 0) {
      return
    }
    player.removeCardAnimal(this.id, 'boar', excess)
    game.actions.handleAnimalPlacement(player, { boar: excess })
  },
}
