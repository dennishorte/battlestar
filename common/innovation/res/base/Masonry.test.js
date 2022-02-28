Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Masonry (with 4)', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        hand: ['Tools', 'The Wheel', 'Fermenting', 'Engineering', 'Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Masonry')

    t.testChoices(request2, ['Tools', 'The Wheel', 'Fermenting', 'Engineering'], 0, 4)

    const request3 = t.choose(game, request2, 'Tools', 'The Wheel', 'Fermenting', 'Engineering')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting', 'Masonry'],
        red: ['Engineering'],
        green: ['The Wheel'],
        blue: ['Tools'],
        hand: ['Sailing'],
        achievements: ['Monument'],
      },
    })
  })
})
