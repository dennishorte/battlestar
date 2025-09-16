module.exports = {
  name: `Delft Pocket Telescope`,
  color: `blue`,
  age: 4,
  expansion: `arti`,
  biscuits: `fhss`,
  dogmaBiscuit: `s`,
  dogma: [
    `Reveal and return a card from your score pile. If you do, draw a {5} and a {6}, then reveal one of the drawn cards that has a symbol in common with the returned card. If you cannot, return the drawn cards and repeat the effect.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      while (true) {
        const card = game.aChooseCard(player, game.getCardsByZone(player, 'score'))

        if (!card) {
          break
        }

        game.mReveal(player, card)
        const returned = game.aReturn(player, card)

        if (!returned) {
          game.log.add({ template: 'Card was not returned' })
          break
        }

        const five = game.aDraw(player, { age: game.getEffectAge(self, 5) })
        const six = game.aDraw(player, { age: game.getEffectAge(self, 6) })

        const source = game.getBiscuitsByCard(card, 'top')
        const choices = []
        for (const card of [five, six]) {
          const biscuits = game.getBiscuitsByCard(card, 'top')
          for (const b of Object.keys(biscuits)) {
            if (source[b] > 0 && biscuits[b] > 0) {
              choices.push(card)
              break
            }
          }
        }

        if (choices.length > 0) {
          const card = game.aChooseCard(player, choices)
          game.mReveal(player, card)
          break
        }
        else {
          game.log.add({ template: 'Neither card has a biscuit matching the returned card' })
          game.aReturn(player, five)
          game.aReturn(player, six)
        }
      }
    }
  ],
}
