module.exports = {
  id: "tree-inspector-d116",
  name: "Tree Inspector",
  deck: "occupationD",
  number: 116,
  type: "occupation",
  players: "1+",
  text: "This card is a \"1 Wood\" accumulation space for you only. Each time the newly revealed action space card is a \"Quarry\" accumulation space, you must discard all wood from this card.",
  isAccumulationSpace: true,
  accumulationForOwnerOnly: true,
  onPlay(_game, _player) {
    this.wood = 0
  },
  onRoundStart(_game, _player) {
    this.wood = (this.wood || 0) + 1
  },
  onRevealRoundCard(game, player, revealedCard) {
    if (revealedCard.isQuarry) {
      this.wood = 0
      game.log.add({
        template: '{player} loses all wood from Tree Inspector due to Quarry reveal',
        args: { player },
      })
    }
  },
  takeWood(game, player) {
    const wood = this.wood || 0
    this.wood = 0
    player.addResource('wood', wood)
    game.log.add({
      template: '{player} takes {amount} wood from Tree Inspector',
      args: { player, amount: wood },
    })
  },
}
