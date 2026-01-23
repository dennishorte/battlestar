Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Esports", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal'],
        yellow: ['Esports'],
        blue: ['Experimentation', 'Software'],
      },
      decks: {
        echo: {
          4: ['Pencil'],
          5: ['Piano'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Esports')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Coal'],
        yellow: ['Esports'],
        blue: ['Experimentation', 'Software'],
        score: ['Pencil', 'Piano'],
      },
    })
  })

  test('dogma: foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal'],
        blue: ['Experimentation', 'Software'],
        hand: ['Reclamation'],
        forecast: ['Esports'],
      },
      decks: {
        echo: {
          4: ['Pencil'],
          5: ['Piano'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Reclamation')

    t.testGameOver(request, 'dennis', 'Esports')
  })
})
