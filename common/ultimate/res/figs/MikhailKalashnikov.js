module.exports = {
  id: `Mikhail Kalashnikov`,  // Card names are unique in Innovation
  name: `Mikhail Kalashnikov`,
  color: `red`,
  age: 9,
  expansion: `figs`,
  biscuits: `pffh`,
  dogmaBiscuit: `f`,
  karma: [
    `If an opponent would meld a card, first choose a top red card on an opponent's board. Choose to either score it, or self-execute it.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      triggerAll: true,
      kind: 'would-first',
      matches: (game, player, { owner }) => player.isOpponent(owner),
      func: (game, player, { self, owner }) => {
        const cardChoices = game
          .players
          .opponents(owner)
          .map(opponent => game.cards.top(opponent, 'red'))
          .filter(card => Boolean(card))
          .map(card => game.actions.cardOption(card))

        if (cardChoices.length === 0) {
          game.log.add({
            template: 'No opponent has a top red card',
          })
          return
        }

        const actions = [
          {
            title: 'score',
            id: 'score',
            choices: cardChoices,
            min: 0,
          },
          {
            title: 'self-execute',
            id: 'self-execute',
            choices: cardChoices,
            min: 0,
          }
        ]

        const selected = game.actions.choose(owner, actions)[0]
        const inner = selected.selection[0]
        const cardId = (inner && typeof inner === 'object') ? inner.id : inner
        const card = game.cards.byId(cardId)

        const selectedId = selected.id ?? selected.title
        if (selectedId === 'score') {
          game.actions.score(owner, card)
        }
        else {
          game.actions.selfExecute(self, owner, card)
        }
      }
    }
  ]
}
