Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Christiaan Huygens', () => {

  test('echo (plus topcard+3 draw)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Christiaan Huygens']
      },
      decks: {
        base: {
          8: ['Flight'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Christiaan Huygens')

    t.testChoices(request, [7,8,9,10])

    request = t.choose(game, request, 8)

    t.testBoard(game, {
      dennis: {
        blue: ['Christiaan Huygens'],
        forecast: ['Flight'],
      },
    })
  })

  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Christiaan Huygens']
      },
      decks: {
        base: {
          7: ['Lighting'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Christiaan Huygens')

    t.testChoices(request, [7,8,9,10])

    request = t.choose(game, request, 7)

    t.testBoard(game, {
      dennis: {
        purple: ['Lighting'],
        blue: ['Christiaan Huygens'],
      },
    })
  })
})
