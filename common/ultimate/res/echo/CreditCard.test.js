Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Credit Card", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Credit Card'],
        yellow: ['Canning'],
      },
      decks: {
        echo: {
          6: ['Loom'],
          9: ['Rock'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Credit Card')
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Credit Card'],
        hand: ['Canning'],
        score: ['Loom'],
        forecast: ['Rock'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Canning', 'Agriculture'],
        hand: ['Email'],
        forecast: ['Credit Card'],
      },
      decks: {
        echo: {
          1: ['Perfume'],
          6: ['Loom'],
          9: ['Rock'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Email')
    request = t.choose(game, request, 'Canning')
    request = t.choose(game, request, 'Agriculture')
    request = t.choose(game, request, 'green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Credit Card', 'Email'],
          splay: 'up',
        },
        hand: ['Canning', 'Agriculture'],
        score: ['Loom', 'Perfume'],
        forecast: ['Rock'],
      },
    })
  })
})
