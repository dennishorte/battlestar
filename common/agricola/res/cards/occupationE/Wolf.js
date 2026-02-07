module.exports = {
  id: "wolf-e103",
  name: "Wolf",
  deck: "occupationE",
  number: 103,
  type: "occupation",
  players: "1+",
  text: "Pile (from bottom to top) 1 clay, 1 wood, and 1 grain on this card. Each time you get a good matching the top item, you can move that item to your supply and get 1 wild boar.",
  onPlay(_game, _player) {
    this.pile = ['clay', 'wood', 'grain']
  },
  onObtainResource(game, player, resourceType) {
    if (this.pile && this.pile.length > 0) {
      const topItem = this.pile[this.pile.length - 1]
      if (resourceType === topItem) {
        this.pile.pop()
        player.addResource(topItem, 1)
        if (player.canPlaceAnimals('boar', 1)) {
          player.addAnimals('boar', 1)
          game.log.add({
            template: '{player} gets 1 {resource} and 1 wild boar from Wolf',
            args: { player, resource: topItem },
          })
        }
      }
    }
  },
}
