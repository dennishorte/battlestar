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
        base: {
          9: ['Collaboration'],
        },
        echo: {
          9: ['Rock'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Radio Telescope')
    request = t.choose(game, request, 'Rock')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Radio Telescope'],
        yellow: ['Ecology'],
        purple: ['Rock'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Radio Telescope'],
        yellow: ['Ecology'],
      },
      decks: {
        base: {
          10: ['A.I.'],
        },
        echo: {
          10: ['Cell Phone'],
        },
      }
    })

    // Empty the nine deck so we can draw A.I., which is a 10.
    game.testSetBreakpoint('before-first-player', (game) => {
      game.state.zones.decks.base['9'].cards().forEach(card => game.mMoveCardTo(card, game.getZoneById('junk')))
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Radio Telescope')
    request = t.choose(game, request, '*A.I.')

    t.testGameOver(request, 'dennis', 'Radio Telescope')
  })
})
