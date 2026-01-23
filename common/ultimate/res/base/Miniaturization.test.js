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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Miniaturization')

    t.testChoices(request, ['Software', 'Services'], 1, 1)

    request = t.choose(game, 'Software')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Miniaturization')

    t.testIsSecondPlayer(game)
    t.testDeckIsJunked(game, 11)
    t.testBoard(game, {
      dennis: {
        red: ['Miniaturization'],
      },
    })
  })
})
