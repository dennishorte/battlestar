module.exports = {
  name: `Bangle`,
  color: `red`,
  age: 1,
  expansion: `echo`,
  biscuits: `hk&1`,
  dogmaBiscuit: `k`,
  echo: [`Tuck a {1} from your hand.`],
  dogma: [
    `Choose to either draw and foreshadow a {2} or tuck a {2} from your forecast.`,
    `If you have no cards in your forecast, draw and foreshadow a {3}`,
  ],
  dogmaImpl: [
    (game, player) => {
      const choices = ['Draw and foreshadow']

      const forecast = game
        .cards.byZone(player, 'forecast')
        .filter(card => card.getAge() === game.getEffectAge(this, 2))

      if (forecast) {
        choices.push({
          title: 'Tuck from forecast',
          options: forecast,
          min: 0,
        })
      }

      const choice = game.aChoose(player, choices)[0]

      if (choice === choices[0]) {
        game.actions.drawAndForeshadow(player, game.getEffectAge(this, 2))
      }
      else {
        const card = game.getCardByName(choice.selection[0])
        game.aTuck(player, card)
      }
    },

    (game, player) => {
      const count = game
        .cards.byZone(player, 'forecast')
        .length

      if (count === 0) {
        game.actions.drawAndForeshadow(player, game.getEffectAge(this, 3))
      }
      else {
        game.mLogNoEffect()
      }
    },
  ],
  echoImpl: [
    (game, player) => {
      const cards = game
        .zones.byPlayer(player, 'hand')
        .cardlist()
        .filter(card => card.getAge() === game.getEffectAge(this, 1))

      game.actions.chooseAndTuck(player, cards)
    }
  ],
}
