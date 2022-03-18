Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bill of Rights', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Bill of Rights'],
        blue: ['Pottery'],
      },
      micah: {
        blue: ['Experimentation', 'Tools', 'Alchemy']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation', 'Tools', 'Alchemy', 'Pottery'],
      }
    })
  })
})
