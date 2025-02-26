Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Excalibur', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Excalibur'],
        red: ['Construction'],
        purple: ['Philosophy'],
      },
      micah: {
        green: ['The Wheel'],
        red: ['Metalworking'],
        purple: ['Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testChoices(request2, ['The Wheel', 'Enterprise'])

    const request3 = t.choose(game, request2, 'The Wheel')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        red: ['Construction'],
        purple: ['Philosophy'],
      },
      micah: {
        red: ['Metalworking'],
        purple: ['Enterprise'],
      },
    })
  })
})
