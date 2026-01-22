Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Chopsticks", () => {

  test('dogma: not eligible', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Chopsticks'],
      },
      decks: {
        echo: {
          1: ['Bangle'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Chopsticks')
    request = t.choose(game, 'yes')
    request = t.choose(game, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Chopsticks'],
        forecast: ['Bangle'],
      },
    })
  })

  test('dogma: eligible', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Construction'],
        yellow: ['Chopsticks'],
        score: ['Software'],
      },
      decks: {
        echo: {
          1: ['Bangle'],
        },
      },
      junk: ['Fermenting'],
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Chopsticks')
    request = t.choose(game, 'yes')
    request = t.choose(game, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Construction'],
        yellow: ['Chopsticks'],
        score: ['Software'],
        forecast: ['Bangle'],
        achievements: ['Fermenting'],
      },
    })
  })
})
