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
        const card = game.actions.chooseCard(player, game.cards.byPlayer(player, 'score'))

        if (!card) {
          break
        }

        game.actions.reveal(player, card)
        const returned = game.actions.return(player, card)

        if (!returned) {
          game.log.add({ template: 'Card was not returned' })
          break
        }

        const five = game.actions.draw(player, { age: game.getEffectAge(self, 5) })
        const six = game.actions.draw(player, { age: game.getEffectAge(self, 6) })

        const source = card.visibleBiscuitsParsed()
        const choices = []
        for (const card of [five, six]) {
          const biscuits = card.visibleBiscuitsParsed()
          for (const b of Object.keys(biscuits)) {
            if (source[b] > 0 && biscuits[b] > 0) {
              choices.push(card)
              break
            }
          }
        }

        if (choices.length > 0) {
          const card = game.actions.chooseCard(player, choices)
          game.actions.reveal(player, card)
          break
        }
        else {
          game.log.add({ template: 'Neither card has a biscuit matching the returned card' })
          game.actions.return(player, five)
          game.actions.return(player, six)
        }
      }
    }
  ],
}
