module.exports = {
  name: `Machine Gun`,
  color: `red`,
  age: 7,
  expansion: `echo`,
  biscuits: `ff&h`,
  dogmaBiscuit: `f`,
  echo: [`If you have five top cards, draw and score a {7}.`],
  dogma: [
    `I demand you transfer all of your top cards with a bonus to my score pile! If you transferred any, draw a {7}!`,
    `Return all your non-red top cards.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const toTransfer = game
        .cards.tops(player)
        .filter(card => card.checkHasBonus())
      const transferred = game.aTransferMany(player, toTransfer, game.zones.byPlayer(leader, 'score'))

      if (transferred && transferred.length > 0) {
        game.aDraw(player, { age: game.getEffectAge(this, 7) })
      }
    },

    (game, player) => {
      const toReturn = game
        .cards.tops(player)
        .filter(card => card.color !== 'red')
      game.aReturnMany(player, toReturn)
    }
  ],
  echoImpl: [
    (game, player) => {
      const topCards = game.cards.tops(player)
      if (topCards.length === 5) {
        game.actions.drawAndScore(player, game.getEffectAge(this, 7))
      }
      else {
        game.mLogNoEffect()
      }
    }
  ],
}
