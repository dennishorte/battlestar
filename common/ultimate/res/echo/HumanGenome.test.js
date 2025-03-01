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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Human Genome')
    request = t.choose(game, request, 'yes')
    request = t.choose(game, request, 4)
    request = t.choose(game, request, 'Canning')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Human Genome')
    request = t.choose(game, request, 'yes')
    request = t.choose(game, request, 10)
  })
})
