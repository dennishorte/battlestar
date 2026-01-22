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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Evolution')
    request = t.choose(game, 'Draw and Score and Return')
    request = t.choose(game, 'Mapmaking')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Evolution')
    request = t.choose(game, 'Draw a Higher Card')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Evolution'],
        score: ['Flight'],
        hand: ['Computers'],
      },
    })
  })
})
