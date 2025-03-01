Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Holmegaard Bows', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Holmegaard Bows'],
      },
      micah: {
        red: ['Construction'],
        green: ['The Wheel'],
        yellow: ['Agriculture'],
      },
      decks: {
        base: {
          1: ['Tools'],
          2: ['Fermenting', 'Calendar']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Calendar', 'Construction', 'Tools'],
      },
      micah: {
        yellow: ['Agriculture'],
        green: ['The Wheel'],
        hand: ['Fermenting'],
      },
    })
  })
})
