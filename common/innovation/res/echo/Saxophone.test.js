Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Saxophone", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Saxophone'],
      },
      micah: {
        purple: ['Bell']
      },
      decks: {
        base: {
          7: ['Lighting'],
        },
        echo: {
          7: ['Rubber'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Saxophone')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Saxophone'],
        hand: ['Lighting', 'Rubber'],
      },
      micah: {
        purple: ['Bell'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Saxophone', 'Piano', 'Flute'],
      },
      micah: {
        purple: ['Bell']
      },
      decks: {
        base: {
          7: ['Lighting'],
        },
        echo: {
          7: ['Rubber'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Saxophone')
    const request3 = t.choose(game, request2, 'purple')

    t.testGameOver(request3, 'dennis', 'Saxophone')
  })
})
