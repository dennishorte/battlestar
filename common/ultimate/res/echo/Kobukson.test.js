Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Kobukson", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Kobukson', 'Construction'],
      },
      micah: {
        yellow: {
          cards: ['Fermenting', 'Domestication', 'Masonry'],
          splay: 'right'
        },
        green: ['Sailing'],
        red: ['Archery'],
      },
      decks: {
        base: {
          4: ['Gunpowder', 'Enterprise'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Kobukson')
    request = t.choose(game, request, 'dennis red')
    request = t.choose(game, request, 'auto')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Kobukson', 'Construction'],
          splay: 'left'
        },
        purple: ['Enterprise'],
      },
      micah: {
        yellow: {
          cards: ['Domestication', 'Masonry'],
          splay: 'right'
        },
        green: ['Sailing'],
        red: ['Gunpowder'],
      },
    })
  })
})
