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
        const choices = game
          .players
          .opponents(owner)
          .map(opponent => game.cards.top(opponent, 'red'))
          .filter(card => Boolean(card))
          .map(card => card.id)

        if (choices.length === 0) {
          game.log.add({
            template: 'No opponent has a top red card',
          })
          return
        }

        const actions = [
          {
            title: 'score',
            choices,
            min: 0,
          },
          {
            title: 'self-execute',
            choices,
            min: 0,
          }
        ]

        const selected = game.actions.choose(owner, actions)[0]
        const card = game.cards.byId(selected.selection[0])

        if (selected.title === 'score') {
          game.actions.score(owner, card)
        }
        else {
          game.actions.selfExecute(self, owner, card)
        }
      }
    }
  ]
}
