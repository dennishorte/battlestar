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
          4: ['Gunpowder'],
        },
        echo: {
          4: ['Pencil']
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Kobukson')
    request = t.choose(game, 'dennis red')
    request = t.choose(game, 'auto')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Kobukson', 'Construction'],
          splay: 'left'
        },
        yellow: ['Pencil'],
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

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Construction'],
        hand: ['Atomic Theory'],
        forecast: ['Kobukson'],
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
          4: ['Gunpowder'],
        },
        echo: {
          4: ['Pencil'],
          5: ['Seed Drill'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Atomic Theory')
    request = t.choose(game, 'dennis red')
    request = t.choose(game, 'auto')


    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Atomic Theory'],
        green: ['Seed Drill'],
        red: {
          cards: ['Kobukson', 'Construction'],
          splay: 'left'
        },
        yellow: ['Pencil'],
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
