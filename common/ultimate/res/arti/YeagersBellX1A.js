module.exports = {
  name: `Yeager's Bell X-1A`,
  color: `blue`,
  age: 9,
  expansion: `arti`,
  biscuits: `iifh`,
  dogmaBiscuit: `i`,
  dogma: [
    `Draw and meld a {9}. Execute the effects of the melded card as if they were on this card, without sharing. If that card has a {i}, repeat this effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.aDrawAndMeld(player, game.getEffectAge(self, 9))
        if (card) {
          game.aExecuteAsIf(player, card)

          if (card.checkHasBiscuit('i')) {
            game.log.add({ template: 'Card had an {i}.' })
            continue
          }
          else {
            game.log.add({ template: 'Card did not have an {i}.' })
            break
          }
        }
      }
    }
  ],
}
