Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ecology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Ecology'],
        hand: ['The Wheel', 'Tools'],
      },
      decks: {
        base: {
          10: ['Robotics', 'Software'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ecology')
    request = t.choose(game, request, 'The Wheel')
    request = t.choose(game, request, 'yes')

    t.testIsSecondPlayer(game)
    t.testDeckIsJunked(game, 10)
    t.testBoard(game, {
      dennis: {
        yellow: ['Ecology'],
        score: ['Tools'],
        hand: ['Robotics', 'Software'],
      },
    })
  })

  test('dogma (no return)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Ecology'],
        hand: ['The Wheel', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Ecology')
    request = t.choose(game, request)
    request = t.choose(game, request, 'no')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Ecology'],
        hand: ['The Wheel', 'Tools'],
      },
    })
  })

})
