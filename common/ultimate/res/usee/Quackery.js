module.exports = {
  name: `Quackery`,
  color: `blue`,
  age: 4,
  expansion: `usee`,
  biscuits: `hsfs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Choose to either score a card from your hand, or draw a {4}.`,
    `Reveal and return exactly two cards in your hand. If you do, draw a card of value equal to the sum number of {l} and {s} on the returned cards.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = [
        'Draw a ' + game.getEffectAge(self, 4),
      ]

      const hand = game.cards.byPlayer(player, 'hand').map(c => c.name)
      if (hand.length > 0) {
        choices.push({
          title: 'Score',
          choices: hand,
          min: 0,
        })
      }

      const selected = game.actions.choose(player, choices, { title: 'Choose an option:' })[0]

      if (selected === 'Draw a 4') {
        game.aDraw(player, { age: game.getEffectAge(self, 4) })
      }
      else {
        const card = game.cards.byId(selected.selection[0])
        game.aScore(player, card)
      }
    },
    (game, player) => {
      const hand = game.cards.byPlayer(player, 'hand')

      if (hand.length < 2) {
        game.log.addNoEffect()
        return
      }

      const revealed = game.aChooseAndReveal(player, hand, { count: 2, ordered: true })
      const returned = game.aReturnMany(player, revealed)

      if (returned.length === 2) {
        const leafCount = returned.map(c => c.getBiscuitCount('l')).reduce((x, acc) => x + acc, 0)
        const bulbCount = returned.map(c => c.getBiscuitCount('s')).reduce((x, acc) => x + acc, 0)
        const drawAge = leafCount + bulbCount

        game.aDraw(player, { age: drawAge })
      }
    }
  ],
}
