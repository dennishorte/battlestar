Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Chintz", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Chintz'],
      },
      decks: {
        base: {
          4: ['Enterprise', 'Gunpowder'],
        },
        echo: {
          4: ['Clock'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Chintz')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Chintz'],
        hand: ['Enterprise', 'Clock'],
        score: ['Gunpowder'],
      },
    })
  })

  test('dogma: more than one in hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Chintz'],
        hand: ['Tools'],
      },
      decks: {
        echo: {
          4: ['Clock'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Chintz')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Chintz'],
        hand: ['Tools', 'Clock'],
      },
    })
  })
})
