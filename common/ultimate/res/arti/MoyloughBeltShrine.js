module.exports = {
  name: `Moylough Belt Shrine`,
  color: `yellow`,
  age: 3,
  expansion: `arti`,
  biscuits: `klhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel your to reveal all cards in your hand and transfer the card of my choice to my board.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const cards = game.cards.byPlayer(player, 'hand')

      if (cards.length === 0) {
        game.log.add({
          template: '{player} has no cards in hand',
          args: { player }
        })
        return
      }

      for (const card of cards) {
        game.mReveal(player, card)
      }

      const card = game.actions.chooseCard(leader, cards)
      game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
    }
  ],
}
