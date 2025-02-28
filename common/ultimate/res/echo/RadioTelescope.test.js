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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Radio Telescope')
    const request3 = t.choose(game, request2, 'Rock')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Radio Telescope')
    const request3 = t.choose(game, request2, '*A.I.')

    t.testGameOver(request3, 'dennis', 'Radio Telescope')
  })
})
