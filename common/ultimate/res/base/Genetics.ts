export default {
  name: `Genetics`,
  color: `blue`,
  age: 9,
  expansion: `base`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld a {e}. Score all cards beneath it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 11))
      if (card) {
        const cards = game.cards.byPlayer(player, card.color)
        const cardIndex = cards.indexOf(card)
        if (cardIndex === -1) {
          game.log.add({
            template: '{card} is not in its stack',
            args: { card }
          })
        }
        else {
          game.actions.scoreMany(player, cards.slice(cardIndex + 1), { ordered: true })
        }
      }
    }
  ],
}
