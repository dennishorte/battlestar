Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Miniturization', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Miniturization'],
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
    const request2 = t.choose(game, request1, 'Dogma.Miniturization')

    t.testChoices(request2, ['Software', 'Services'], 0, 1)

    const request3 = t.choose(game, request2, 'Software')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Miniturization'],
        hand: ['Services', 'Robotics', 'Self Service'],
        score: ['The Wheel', 'Tools', 'Canning'],
      },
    })
  })
})
