Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Chartreuse', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Chartreuse'],
      },
      decks: {
        base: {
          4: ['Navigation'],
          5: ['Astronomy'],
          6: ['Metric System'],
        },
        usee: {
          3: ['Secret Police'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Chartreuse')
    request = t.choose(game, 'Navigation')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Secret Police', 'Chartreuse'],
          splay: 'right',
        },
        green: ['Metric System', 'Navigation'],
      },
    })
  })

})
