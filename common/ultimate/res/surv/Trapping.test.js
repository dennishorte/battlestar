Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Trapping', () => {
  test('placeholder', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        green: ['Trapping'],
      },
    })

    const request = game.run()
    const choose = request.choices[0]

    expect(choose).toBeDefined()
  })
})

