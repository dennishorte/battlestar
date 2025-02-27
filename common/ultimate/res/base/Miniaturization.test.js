Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Miniaturization', () => {

  test('dogma: age 10', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Miniaturization'],
        hand: ['Software', 'Services'],
        score: ['The Wheel', 'Tools', 'Canning'],
      },
      decks: {
        base: {
          10: ['Robotics', 'Self Service']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Miniaturization')

    t.testChoices(request2, ['Software', 'Services'], 1, 1)

    const request3 = t.choose(game, request2, 'Software')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Miniaturization'],
        hand: ['Services', 'Robotics', 'Self Service'],
        score: ['The Wheel', 'Tools', 'Canning'],
      },
    })
  })

  test('dogma: age 11', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Miniaturization'],
        hand: ['Hypersonics'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Miniaturization')

    t.testIsSecondPlayer(request2)
    t.testDeckIsJunked(game, 11)
    t.testBoard(game, {
      dennis: {
        red: ['Miniaturization'],
      },
    })
  })
})
