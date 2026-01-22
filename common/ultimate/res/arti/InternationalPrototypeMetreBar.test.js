Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('International Prototype Metre Bar', () => {

  test('dogma: draws three cards, splays colors, but does not win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game, {
      dennis: {
        artifact: ['International Prototype Metre Bar'],
        red: ['Construction', 'Archery'],
        blue: ['Tools'],
      },
      decks: {
        base: {
          5: ['Coal', 'Banking', 'Steam Engine']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 5)
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'up'
        },
        blue: ['Tools'],
        museum: ['Museum 1', 'International Prototype Metre Bar'],
      },
    })
  })

  test('dogma: wins when all colors have equal number of cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game, {
      dennis: {
        artifact: ['International Prototype Metre Bar'],
        red: ['Gunpowder'],
        blue: ['Tools'],
        purple: ['Code of Laws'],
      },
      decks: {
        base: {
          1: ['Archery', 'Pottery', 'Mysticism']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 1)

    t.testGameOver(request, 'dennis', 'International Prototype Metre Bar')
  })
})
