Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Tanning', () => {
  test('placeholder', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
        dennis: {
          purple: ['Tanning'],
        },
    })

    const request = game.run()
    // Tanning has no dogma effects, so it cannot be dogmatized
    // Just verify the game runs and has valid choices (Draw, Meld, Achieve, etc.)
    expect(request.selectors.length).toBeGreaterThan(0)
  })
})

