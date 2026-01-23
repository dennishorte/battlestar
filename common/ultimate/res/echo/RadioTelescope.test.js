Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Radio Telescope", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Radio Telescope'],
        yellow: ['Ecology'],
      },
      decks: {
        echo: {
          9: ['Rock', 'Calculator'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Radio Telescope')
    request = t.choose(game, 'Calculator')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Ecology'],
        blue: ['Calculator', 'Radio Telescope'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Ecology'],
        hand: ['Software'],
        forecast: ['Radio Telescope'],
      },
      decks: {
        echo: {
          9: ['Rock', 'Calculator'],
          10: ['MP3', 'GPS'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Software')
    request = t.choose(game, 'MP3')
    request = t.choose(game, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['MP3', 'Ecology'],
        blue: ['Radio Telescope', 'Software'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Flight'],
        forecast: ['Radio Telescope'],
      },
      decks: {
        base: {
          9: ['Computers'],
          10: ['A.I.'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Meld.Flight')
    request = t.choose(game, '*A.I.')

    t.testGameOver(request, 'dennis', 'Radio Telescope')
  })
})
