Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Software', () => {
  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Software'],
      },
      decks: {
        base: {
          9: ['Satellites', 'Suburbia'],
          10: ['The Internet'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Software')
    const request3 = t.choose(game, request2, 'no')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Software'],
        yellow: ['Suburbia'],
        green: ['Satellites'],
        score: ['The Internet'],
      },
    })
  })
})
