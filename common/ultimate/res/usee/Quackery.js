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
      const drawAge = game.getEffectAge(self, 4)
      const choices = [
        game.actions.option({ id: 'draw', title: 'Draw a ' + drawAge }),
      ]

      const handCards = game.cards.byPlayer(player, 'hand')
      if (handCards.length > 0) {
        choices.push({
          title: 'Score',
          id: 'score',
          choices: handCards.map(c => game.actions.cardOption(c)),
          min: 0,
        })
      }

      const selected = game.actions.choose(player, choices, { title: 'Choose an option:' })[0]
      const selectedId = (selected && typeof selected === 'object')
        ? (selected.id ?? selected.title)
        : selected

      if (selectedId === 'draw' || (typeof selectedId === 'string' && selectedId.startsWith('Draw a '))) {
        game.actions.draw(player, { age: drawAge })
      }
      else {
        const inner = selected.selection[0]
        const cardId = (inner && typeof inner === 'object') ? inner.id : inner
        const card = game.cards.byId(cardId)
        game.actions.score(player, card)
      }
    },
    (game, player) => {
      const hand = game.cards.byPlayer(player, 'hand')

      if (hand.length < 2) {
        game.log.addNoEffect()
        return
      }

      const revealed = game.actions.chooseAndReveal(player, hand, { count: 2, ordered: true })
      const returned = game.actions.returnMany(player, revealed)

      if (returned.length === 2) {
        const leafCount = returned.map(c => c.getBiscuitCount('l')).reduce((x, acc) => x + acc, 0)
        const bulbCount = returned.map(c => c.getBiscuitCount('s')).reduce((x, acc) => x + acc, 0)
        const drawAge = leafCount + bulbCount

        game.actions.draw(player, { age: drawAge })
      }
    }
  ],
}
