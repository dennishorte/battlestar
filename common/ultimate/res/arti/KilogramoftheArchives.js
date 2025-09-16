module.exports = {
  name: `Kilogram of the Archives`,
  color: `blue`,
  age: 6,
  expansion: `arti`,
  biscuits: `fhfs`,
  dogmaBiscuit: `f`,
  dogma: [
    `Return a card from your hand. Return a top card from your board. If you returned two cards and their values sum to ten, draw and score a {0}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const hand = game.aChooseAndReturn(player, game.getCardsByZone(player, 'hand'))
      const top = game.aChooseAndReturn(player, game.getTopCards(player))

      if (hand && top && hand.length > 0 && top.length > 0) {
        const sum = hand[0].getAge() + top[0].getAge()
        if (sum === 10) {
          game.aDrawAndScore(player, game.getEffectAge(self, 10))
        }
        else {
          game.mLog({ template: 'Card values do not sum to 10' })
        }
      }
    }
  ],
}
