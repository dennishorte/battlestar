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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Suburbia')
    request = t.choose(game, request, 'Agriculture', 'Mapmaking')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
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
