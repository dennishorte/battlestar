Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('First Aid', () => {
  test('placeholder', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        blue: ['First Aid'],
      },
    })

    const request = game.run()
    // First Aid has no dogma effects, so it cannot be dogmatized
    // Just verify the game runs and has valid choices (Draw, Meld, Achieve, etc.)
    expect(request.selectors.length).toBeGreaterThan(0)
  })
})

