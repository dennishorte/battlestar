export default {
  name: `Seikilos Epitaph`,
  color: `blue`,
  age: 2,
  expansion: `arti`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and meld a {3}. Meld your bottom card of the drawn card's color, then self-execute it.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 3))
      if (card) {
        const cards = game.cards.byPlayer(player, card.color)
        const toMeld = cards[cards.length - 1]
        const melded = game.actions.meld(player, toMeld)
        if (melded) {
          game.aSelfExecute(self, player, melded)
        }
      }
    }
  ],
}
