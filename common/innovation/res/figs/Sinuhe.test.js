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
    test('Rivalry decree', () => {
      const game = t.fixtureFirstPicks({ expansions: ['base', 'figs'] })
      t.setColor(game, 'micah', 'purple', ['Sinuhe'])
      t.setHand(game, 'micah', ['Homer', 'Fu Xi'])
      game.run()
      expect(game.getWaiting('micah').options).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Decree',
          options: ['Rivalry']
        })
      ]))
    })

    test(`Each {k} on your board provides one additional point towards your score.`, () => {
      const game = t.fixtureFirstPicks({ expansions: ['base', 'figs'] })
      t.setHand(game, 'micah', ['Sinuhe'])
      game.run()

      expect(game.getScore('micah')).toBe(0)

      t.meld(game, 'Sinuhe')

      expect(game.getScore('micah')).toBe(2)
    })
  })
})
