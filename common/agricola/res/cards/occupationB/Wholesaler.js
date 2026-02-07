module.exports = {
  id: "wholesaler-b137",
  name: "Wholesaler",
  deck: "occupationB",
  number: 137,
  type: "occupation",
  players: "3+",
  text: "Place 1 vegetable, 1 wild boar, 1 stone, and 1 cattle on this card. Each time you use an action space card on round spaces 8 to 11, you get the corresponding good from this card.",
  onPlay(_game, _player) {
    this.goods = { 8: 'vegetables', 9: 'boar', 10: 'stone', 11: 'cattle' }
  },
  onAction(game, player, actionId) {
    const round = game.getActionSpaceRound(actionId)
    if (this.goods && this.goods[round]) {
      const good = this.goods[round]
      if (good === 'boar' || good === 'cattle') {
        if (player.canPlaceAnimals(good, 1)) {
          player.addAnimals(good, 1)
          game.log.add({
            template: '{player} gets 1 {animal} from Wholesaler',
            args: { player, animal: good },
          })
        }
      }
      else {
        player.addResource(good, 1)
        game.log.add({
          template: '{player} gets 1 {resource} from Wholesaler',
          args: { player, resource: good },
        })
      }
      delete this.goods[round]
    }
  },
}
