Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Astrobiology', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Astrobiology', 'Physics', 'Pottery', 'Chemistry', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Astrobiology')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Astrobiology', 'Pottery'],
          splay: 'aslant',
        },
        score: ['Physics', 'Chemistry'],
      },
    })
  })

})
