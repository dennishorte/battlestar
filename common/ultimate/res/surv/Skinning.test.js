Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Skinning', () => {
  test('placeholder', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'] })
    t.setBoard(game, {
      dennis: {
        red: ['Skinning'],
      },
    })

    const request = game.run()
    const choose = request.choices[0]

    expect(choose).toBeDefined()
  })
})

