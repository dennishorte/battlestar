Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Human Genome", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Human Genome'],
        yellow: ['Agriculture', 'Canning'],
      },
      decks: {
        base: {
          4: ['Enterprise'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Human Genome')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 4)
    const request5 = t.choose(game, request4, 'Canning')

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        blue: ['Human Genome'],
        yellow: ['Agriculture'],
        hand: ['Canning'],
        score: ['Enterprise'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Human Genome'],
      },
      decks: {
        base: {
          10: ['Self Service'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Human Genome')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 10)
  })
})
