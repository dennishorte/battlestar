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
      const cards = game.getCardsByZone(player, 'hand')

      if (cards.length === 0) {
        game.mLog({
          template: '{player} has no cards in hand',
          args: { player }
        })
        return
      }

      for (const card of cards) {
        game.mReveal(player, card)
      }

      const card = game.aChooseCard(leader, cards)
      game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
    }
  ],
}
