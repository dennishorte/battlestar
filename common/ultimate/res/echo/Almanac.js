module.exports = {
  name: `Almanac`,
  color: `blue`,
  age: 3,
  expansion: `echo`,
  biscuits: `hl4&`,
  dogmaBiscuit: `l`,
  echo: `Draw and foreshadow an Echoes {4}.`,
  dogma: [
    `You may return a card from your forecast with a bonus. If you do, draw and score a card of value one higher than that bonus.`,
    `If Almanac was foreseen, foreshadow all cards in another player's forecast.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = game
        .cards.byPlayer(player, 'forecast')
        .filter(card => card.checkHasBonus())

      const cards = game.aChooseAndReturn(player, choices, { min: 0, max: 1 })
      if (cards && cards.length > 0) {
        const card = cards[0]
        const bonuses = card.getBonuses()
        game.actions.drawAndScore(player, bonuses[0] + 1)
      }
    },

    (game, player, { foreseen, self }) => {
      if (foreseen) {
        game.mLogWasForeseen(self)

        const others = game.getPlayerAll().filter(o => o.name !== player.name)
        const other = game.aChoosePlayer(player, others)
        game.actions.foreshadowMany(player, game.cards.byPlayer(other, 'forecast'))
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
  echoImpl: (game, player) => {
    game.actions.drawAndForeshadow(player, game.getEffectAge(this, 4), { exp: 'echo' })
  },
}
