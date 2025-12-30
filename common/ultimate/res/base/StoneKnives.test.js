Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Stone Knives', () => {
  test('placeholder', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
        dennis: {
          red: ['Stone Knives'],
        },
    })

    const request = game.run()
    // Stone Knives has no dogma effects, so it cannot be dogmatized
    // Just verify the game runs and has valid choices (Draw, Meld, Achieve, etc.)
    expect(request.selectors.length).toBeGreaterThan(0)
  })
})

