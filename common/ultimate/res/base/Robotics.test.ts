Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Robotics', () => {
  test('dogma: no matching biscuit, no green', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        red: ['Robotics'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          10: ['Miniaturization'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Robotics')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Miniaturization', 'Robotics'],
      },
    })
  })

  test('dogma: no matching biscuit, with green', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        red: ['Robotics'],
        green: ['Sailing', 'Currency'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          10: ['Stem Cells'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Robotics')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Robotics'],
        green: ['Currency'],
        yellow: ['Stem Cells'],
        score: ['Sailing'],
        hand: ['Tools'],
      },
    })
  })
})
