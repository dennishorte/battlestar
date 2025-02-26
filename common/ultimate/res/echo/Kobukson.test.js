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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Kobukson')
    const request3 = t.choose(game, request2, 'dennis red')
    const request4 = t.choose(game, request3, 'auto')


    t.testIsSecondPlayer(request4)
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
