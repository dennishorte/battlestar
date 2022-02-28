Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Evolution', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Evolution'],
        score: ['Mapmaking'],
      },
      decks: {
        base: {
          8: ['Flight']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Evolution')
    const request3 = t.choose(game, request2, 'Draw and Score and Return')
    const request4 = t.choose(game, request3, 'Mapmaking')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        blue: ['Evolution'],
        score: ['Flight'],
      },
    })
  })

  test('dogma (draw higher)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Evolution'],
        score: ['Flight'],
      },
      decks: {
        base: {
          9: ['Computers'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Evolution')
    const request3 = t.choose(game, request2, 'Draw a Higher Card')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        blue: ['Evolution'],
        score: ['Flight'],
        hand: ['Computers'],
      },
    })
  })
})
