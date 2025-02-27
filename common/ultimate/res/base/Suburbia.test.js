Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Suburbia', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        yellow: ['Suburbia'],
        green: ['Navigation'],
        hand: ['Agriculture', 'Mapmaking', 'Canning'],
      },
      decks: {
        base: {
          1: ['The Wheel', 'Tools']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Suburbia')
    const request3 = t.choose(game, request2, 'Agriculture', 'Mapmaking')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'yes')

    t.testIsSecondPlayer(request5)
    t.testDeckIsJunked(game, 9)
    t.testBoard(game, {
      dennis: {
        yellow: ['Suburbia', 'Agriculture'],
        green: ['Navigation', 'Mapmaking'],
        hand: ['Canning'],
        score: ['The Wheel', 'Tools'],
      },
    })
  })
})
