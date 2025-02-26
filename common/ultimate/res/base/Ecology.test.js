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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Ecology')
    const request3 = t.choose(game, request2, 'The Wheel')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Ecology')
    const request3 = t.choose(game, request2)

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        yellow: ['Ecology'],
        hand: ['The Wheel', 'Tools'],
      },
    })
  })

})
