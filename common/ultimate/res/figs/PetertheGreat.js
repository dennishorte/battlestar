module.exports = {
  id: `Peter the Great`,  // Card names are unique in Innovation
  name: `Peter the Great`,
  color: `red`,
  age: 5,
  expansion: `figs`,
  biscuits: `f*5h`,
  dogmaBiscuit: `f`,
  echo: ``,
  karma: [
    `When you meld this card, return all opponents' top figures.`,
    `If you would tuck a card with a {f}, first achieve your bottom green card, if elibible. Otherwise, score it.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'when-meld',
      func: (game, player) => {
        const figs = game
          .getPlayerOpponents(player)
          .flatMap(player => game.getTopCards(player))
          .filter(card => card.checkIsFigure())
        game.aReturnMany(player, figs)
      }
    },
    {
      trigger: 'tuck',
      kind: 'would-first',
      matches: (game, player, { card }) => card.checkHasBiscuit('f'),
      func: (game, player) => {
        const card = game.getCardsByZone(player, 'green').slice(-1)[0]
        if (card) {
          if (game.checkAchievementEligibility(player, card)) {
            game.aClaimAchievement(player, card)
          }
          else {
            game.aScore(player, card)
          }
        }
        else {
          game.mLogNoEffect()
        }
      }
    }
  ]
}
