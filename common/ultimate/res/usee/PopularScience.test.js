Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Popular Science', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Statistics'],
        green: ['Paper'],
        blue: ['Popular Science', 'Tools'],
      },
      micah: {
        green: ['Navigation'],
      },
      decks: {
        base: {
          6: ['Canning'],
        },
        usee: {
          4: ['Legend'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Popular Science')
    request = t.choose(game, request, '4')
    request = t.choose(game, request, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Canning', 'Statistics'],
        green: ['Paper'],
        blue: {
          cards: ['Popular Science', 'Tools'],
          splay: 'right',
        },
        purple: ['Legend'],
      },
      micah: {
        green: ['Navigation'],
      },
    })
  })

})
