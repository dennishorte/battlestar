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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Christiaan Huygens')

    t.testChoices(request2, [7,8,9,10])

    const request3 = t.choose(game, request2, 8)

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Christiaan Huygens')

    t.testChoices(request2, [7,8,9,10])

    const request3 = t.choose(game, request2, 7)

    t.testBoard(game, {
      dennis: {
        purple: ['Lighting'],
        blue: ['Christiaan Huygens'],
      },
    })
  })
})
