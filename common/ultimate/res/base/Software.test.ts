Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Software')
    request = t.choose(game, request, 'no')

    t.testIsSecondPlayer(game)
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
