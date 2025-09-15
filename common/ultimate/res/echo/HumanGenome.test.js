Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Human Genome", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal', 'Construction'],
        yellow: ['Agriculture', 'Canning'],
        blue: ['Human Genome'],
      },
      decks: {
        echo: {
          10: ['Barcode'],
          11: ['Deepfake'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Human Genome')
    request = t.choose(game, request, 10)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        blue: ['Human Genome'],
        yellow: ['Agriculture', 'Canning'],
        hand: ['Construction', 'Deepfake'],
        score: ['Barcode'],
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
    request = t.choose(game, request, 10)
  })
})
