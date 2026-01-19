export default {
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
    (game, player, { self }) => {
      const choices = ['Draw and foreshadow']

      const forecast = game
        .cards
        .byPlayer(player, 'forecast')
        .filter(card => card.getAge() === game.getEffectAge(self, 2))

      if (forecast.length > 0) {
        choices.push('Tuck from forecast')
      }

      const choice = game.actions.choose(player, choices)[0]

      if (choice === 'Draw and foreshadow') {
        game.actions.drawAndForeshadow(player, game.getEffectAge(self, 2))
      }
      else {
        game.actions.chooseAndTuck(player, forecast)
      }
    },

    (game, player, { self }) => {
      const count = game
        .cards
        .byPlayer(player, 'forecast')
        .length

      if (count === 0) {
        game.actions.drawAndForeshadow(player, game.getEffectAge(self, 3))
      }
      else {
        game.log.addNoEffect()
      }
    },
  ],
  echoImpl: [
    (game, player, { self }) => {
      const cards = game
        .zones
        .byPlayer(player, 'hand')
        .cardlist()
        .filter(card => card.getAge() === game.getEffectAge(self, 1))

      game.actions.chooseAndTuck(player, cards)
    }
  ],
}
