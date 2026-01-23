Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Pantheism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pantheism'],
        red: ['Optics'],
        hand: ['Reformation'],
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        },
        usee: {
          4: ['Ninja'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pantheism')
    request = t.choose(game, 'purple')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Optics', 'Ninja', 'Gunpowder'],
          splay: 'right',
        },
        score: ['Pantheism', 'Reformation'],
      },
    })
  })

})
