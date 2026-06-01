module.exports = {
  id: `John Harrison`,  // Card names are unique in Innovation
  name: `John Harrison`,
  color: `green`,
  age: 6,
  expansion: `figs`,
  biscuits: `6chp`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `If you would take a Draw action, first return a card from your hand. If you do, draw a card from any set of value equal to the returned card.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade'
    },
    {
      trigger: 'draw-action',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const returnedCard = game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { count: 1 })[0]
        if (returnedCard) {
          const expChoices = game.settings.expansions.map(e =>
            game.actions.option({ id: e, title: e, kind: 'expansion' })
          )
          const expansion = game.actions.choose(player, expChoices, {
            title: 'Choose a deck to draw from',
          })
          // Preserve legacy shape: original code passed the selection array directly.
          const exp = expansion.map(s => (s && typeof s === 'object') ? s.id : s)
          game.actions.draw(player, { age: returnedCard.getAge(), exp })
        }
      }
    }
  ]
}
