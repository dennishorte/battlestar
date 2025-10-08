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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testChoices(request, ['The Wheel', 'Enterprise'])

    request = t.choose(game, request, 'The Wheel')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        red: ['Construction'],
        purple: ['Philosophy'],
        museum: ['Museum 1', 'Excalibur'],
      },
      micah: {
        red: ['Metalworking'],
        purple: ['Enterprise'],
      },
    })
  })
})
