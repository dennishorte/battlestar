Error.stackTraceLimit = 100
import t from '../../testutil.js'
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
    request = t.choose(game, request, 'Dogma.Pantheism')
    request = t.choose(game, request, 'purple')
    request = t.choose(game, request, 'auto')

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
