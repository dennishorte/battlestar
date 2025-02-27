Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Socialism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Socialism'],
        green: ['Invention', 'Paper'],
        hand: ['Code of Laws', 'The Wheel', 'Clothing']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Socialism')
    const request3 = t.choose(game, request2, 'Invention')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4)

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        purple: ['Socialism', 'Code of Laws'],
        green: ['Paper', 'Invention', 'The Wheel', 'Clothing'],
      },
    })
  })
})
