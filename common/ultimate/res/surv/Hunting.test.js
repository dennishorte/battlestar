Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hunting', () => {
  test('placeholder', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        red: ['Hunting'],
      },
    })

    const request = game.run()
    const choose = request.choices[0]

    expect(choose).toBeDefined()
  })
})

