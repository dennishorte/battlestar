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
        museum: ['Museum 1', 'Holmegaard Bows'],
      },
      micah: {
        yellow: ['Agriculture'],
        green: ['The Wheel'],
        hand: ['Fermenting'],
      },
    })
  })

  test('dogma: if you do not', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Holmegaard Bows'],
      },
      micah: {
        red: ['Gunpowder', 'Construction'],
        yellow: ['Agriculture'],
      },
      achievements: [],
      decks: {
        base: {
          2: ['Fermenting', 'Calendar', 'Mapmaking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Calendar', 'Mapmaking'],
        museum: ['Museum 1', 'Holmegaard Bows'],
      },
      micah: {
        red: ['Gunpowder', 'Construction'],
        yellow: ['Agriculture'],
        hand: ['Fermenting'],
      },
      junk: [
        "Archery",
        "City States",
        "Clothing",
        "Code of Laws",
        "Domestication",
        "Masonry",
        "Metalworking",
        "Mysticism",
        "Oars",
        "Pottery",
        "Sailing",
        "The Wheel",
        "Tools",
        "Writing",
      ]
    })
  })
})
