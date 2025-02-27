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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Vaccination')
    const request3 = t.choose(game, request2, 1)
    const request4 = t.choose(game, request3, 'auto')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Vaccination')

    t.testIsSecondPlayer(request2)

    t.testBoard(game, {
      dennis: {
        yellow: ['Vaccination'],
      },
    })
  })

})
