module.exports = {
  id: "wolf-e103",
  name: "Wolf",
  deck: "occupationE",
  number: 103,
  type: "occupation",
  players: "1+",
  text: "Pile (from bottom to top) 1 clay, 1 wood, and 1 grain on this card. Each time you get a good matching the top item, you can move that item to your supply and get 1 wild boar.",
  onPlay(game, _player) {
    game.cardState(this.id).pile = ['clay', 'wood', 'grain']
  },
  onObtainResource(game, player, resourceType) {
    const pile = game.cardState(this.id).pile
    if (pile && pile.length > 0) {
      const topItem = pile[pile.length - 1]
      if (resourceType === topItem) {
        pile.pop()
        player.addResource(topItem, 1)
        if (player.canPlaceAnimals('boar', 1)) {
          player.addAnimals('boar', 1)
          game.log.add({
            template: '{player} gets 1 {resource} and 1 wild boar from {card}',
            args: { player, resource: topItem , card: this},
          })
        }
      }
    }
  },
}
