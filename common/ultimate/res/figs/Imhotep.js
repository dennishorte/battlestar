module.exports = {
  id: `Imhotep`,  // Card names are unique in Innovation
  name: `Imhotep`,
  color: `blue`,
  age: 1,
  expansion: `figs`,
  biscuits: `khkp`,
  dogmaBiscuit: `k`,
  karma: [
    `If you would dogma a {1} as your second action, first draw and meld a {2}, then splay left the color of the melded card on your board. If you do both, and the melded card was a {2}, return the top card of that color from all boards.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player, { card, self }) => {
        const secondActionCondition = game.state.actionNumber === 2
        const ageCondition = card.getAge() === game.getEffectAge(self, 1)
        return secondActionCondition && ageCondition
      },
      func: (game, player, { self }) => {
        const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 2))
        const splayed = game.actions.splay(player, card.color, 'left')

        if (splayed && card.getAge() === game.getEffectAge(self, 2)) {
          const toReturn = game
            .players
            .all()
            .map(p => game.cards.top(p, card.color))
          game.actions.returnMany(player, toReturn)
        }
      }
    }
  ]
}
