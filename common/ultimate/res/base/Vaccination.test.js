Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Vaccination', () => {

  test('demand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Vaccination'],
      },
      micah: {
        score: ['The Wheel', 'Code of Laws', 'Calendar', 'Enterprise'],
      },
      decks: {
        base: {
          6: ['Canning'],
          7: ['Lighting'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Vaccination')
    request = t.choose(game, 1)
    request = t.choose(game, 'auto')

    t.testBoard(game, {
      dennis: {
        yellow: ['Vaccination'],
        purple: ['Lighting'],
      },
      micah: {
        yellow: ['Canning'],
        score: ['Calendar', 'Enterprise'],
      },
    })
  })

  test('demand (nothing returned)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Vaccination'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Vaccination')

    t.testIsSecondPlayer(game)

    t.testBoard(game, {
      dennis: {
        yellow: ['Vaccination'],
      },
    })
  })

})
