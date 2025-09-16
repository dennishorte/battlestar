module.exports = {
  id: `Augustus Caesar`,  // Card names are unique in Innovation
  name: `Augustus Caesar`,
  color: `green`,
  age: 2,
  expansion: `figs`,
  biscuits: `khk*`,
  dogmaBiscuit: `k`,
  echo: ``,
  karma: [
    `If any player would meld or foreshadow a card of value less than 4, first reveal it. If it is red or green and has a {k}, instead transfer it to your board, then tuck all cards from your forecast.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: ['meld', 'foreshadow'],
      triggerAll: true,
      kind: 'variable',
      matches: (game, player, { card }) => {
        return card.age < 4
      },
      func(game, player, { card, owner }) {
        game.mReveal(player, card)

        const biscuitRequirement = card.biscuits.includes('k')
        const colorRequirement = card.color === 'green' || card.color === 'red'
        if (biscuitRequirement && colorRequirement) {
          const target = game.getZoneByPlayer(owner, card.color)
          game.mTransfer(owner, card, target)
          game.actions.tuckMany(owner, game.getCardsByZone(owner, 'forecast'))
          return 'would-instead'
        }
        else {
          game.log.add({ template: 'no additional effect' })
          return 'would-first'
        }
      },
    }
  ]
}
