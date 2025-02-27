Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Fusion', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Fusion'],
        purple: ['Services'],
        green: ['Mass Media'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fusion')
    const request3 = t.choose(game, request2, 9)
    const request4 = t.choose(game, request3, 7)

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        green: ['Mass Media'],
        score: ['Fusion', 'Services'],
      },
    })
  })

})
