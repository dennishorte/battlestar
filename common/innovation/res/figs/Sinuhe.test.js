Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sinuhe', () => {
  describe('echo', () => {
    test('Draw and foreshadow a {2} or {3}', () => {
      const game = t.fixtureDogma('Sinuhe', { expansions: ['base', 'figs'] })
      game.run()
      t.dogma(game, 'Sinuhe')

      game.submit({
        actor: 'micah',
        name: 'Choose Age',
        option: [3],
      })

      expect(game.getForecast('micah').cards.length).toBe(1)

      const forecastedCard = game.getCardData(game.getForecast('micah').cards[0])
      expect(forecastedCard.age).toBe(3)
    })
  })

  describe('karma', () => {

  })
})
