module.exports = {
  id: `Queen Victoria`,  // Card names are unique in Innovation
  name: `Queen Victoria`,
  color: `purple`,
  age: 7,
  expansion: `figs`,
  biscuits: `ss&h`,
  dogmaBiscuit: `s`,
  echo: `Transfer a figure from any score pile to yours.`,
  karma: [
    `You may issue a Rivalry Decree with any two figures.`,
    `If you would claim a standard achievement, first make an achievement available from any lower non-empty age.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const choices = game
      .getPlayerAll()
      .filter(other => other !== player)
      .flatMap(player => game.getCardsByZone(player, 'score'))
      .filter(card => card.checkIsFigure())
    game.aChooseAndTransfer(player, choices, game.getZoneByPlayer(player, 'score'))
  },
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: (game, player, { isStandard }) => isStandard,
      func: (game, player, { card }) => {
        const ages = game
          .getNonEmptyAges()
          .filter(age => age < card.getAge())
        const age = game.aChooseAge(player, ages)
        if (age) {
          const deckCards = game.getZoneByDeck('base', age).cards()
          const card = deckCards[deckCards.length - 1]
          game.mMoveCardTo(card, game.getZoneById('achievements'))
          game.log.add({
            template: '{player} moves {card} to the available achievements',
            args: { player, card }
          })
        }
        else {
          game.log.addNoEffect()
        }
      }
    }
  ]
}
