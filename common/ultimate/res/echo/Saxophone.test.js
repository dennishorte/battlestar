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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Saxophone')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Saxophone')
    request = t.choose(game, request, 'purple')

    t.testGameOver(request, 'dennis', 'Saxophone')
  })
})
