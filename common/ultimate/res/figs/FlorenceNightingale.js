module.exports = {
  id: `Florence Nightingale`,  // Card names are unique in Innovation
  name: `Florence Nightingale`,
  color: `yellow`,
  age: 7,
  expansion: `figs`,
  biscuits: `hl*7`,
  dogmaBiscuit: `l`,
  echo: ``,
  karma: [
    `You may issue an Expansion decree with any two figures.`,
    `If an opponent's effect would transfer, return, or remove a card from your score pile, instead leave it there.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion'
    },
    {
      trigger: ['transfer', 'return', 'remove'],
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player, { card }) => {
        const florenceOwner = game.getPlayerByCard(this)
        const cardOwner = game.getPlayerByCard(card)

        const thisIsMyCardCondition = florenceOwner === cardOwner
        const thisIsNotMyEffectCondition = florenceOwner !== game.state.dogmaInfo.effectLeader
        const cardIsInMyScoreCondition =
          game.getZoneByCard(card) === game.getZoneByPlayer(cardOwner, 'score')

        return thisIsMyCardCondition && thisIsNotMyEffectCondition && cardIsInMyScoreCondition
      },
      func: (game, player, { card }) => {
        game.mLog({
          template: '{card} is not moved',
          args: { card }
        })
      }
    }
  ]
}
