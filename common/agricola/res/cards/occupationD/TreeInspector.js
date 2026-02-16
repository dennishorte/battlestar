module.exports = {
  id: "tree-inspector-d116",
  name: "Tree Inspector",
  deck: "occupationD",
  number: 116,
  type: "occupation",
  players: "1+",
  text: "This card is a \"1 Wood\" accumulation space for you only. Each time the newly revealed action space card is a \"Quarry\" accumulation space, you must discard all wood from this card.",
  onPlay(game, _player) {
    game.cardState(this.id).wood = 0
  },
  onRoundStart(game, _player) {
    const s = game.cardState(this.id)
    s.wood = (s.wood || 0) + 1
  },
  onRevealRoundCard(game, player, revealedCard) {
    if (revealedCard.accumulates && revealedCard.accumulates.stone) {
      const s = game.cardState(this.id)
      if (s.wood > 0) {
        game.log.add({
          template: '{player} loses {amount} wood from Tree Inspector (Quarry revealed)',
          args: { player, amount: s.wood },
        })
        s.wood = 0
      }
    }
  },
  allowsAnytimeAction: true,
  getAnytimeActions(game, _player) {
    const s = game.cardState(this.id)
    if (!s.wood || s.wood <= 0) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'takeWood',
      description: `Take ${s.wood} wood from Tree Inspector`,
    }]
  },
  takeWood(game, player) {
    const s = game.cardState(this.id)
    const wood = s.wood
    s.wood = 0
    player.addResource('wood', wood)
    game.log.add({
      template: '{player} takes {amount} wood from Tree Inspector',
      args: { player, amount: wood },
    })
  },
}
