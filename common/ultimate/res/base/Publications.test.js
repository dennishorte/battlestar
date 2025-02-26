Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Publications', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Publications', 'Tools'],
        green: ['Sailing', 'Navigation', 'Databases', 'The Wheel'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Publications')

    t.testChoices(request2, ['blue', 'green'])

    const request3 = t.choose(game, request2, 'green')
    const request4 = t.choose(game, request3, 'Databases')
    const request5 = t.choose(game, request4, 'auto')
    const request6 = t.choose(game, request5, 'blue')

    t.testIsSecondPlayer(request6)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Publications', 'Tools'],
          splay: 'up',
        },
        green: ['Databases', 'Sailing', 'Navigation', 'The Wheel'],
      },
    })
  })
})
