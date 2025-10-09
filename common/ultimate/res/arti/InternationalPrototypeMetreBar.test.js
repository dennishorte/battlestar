Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('International Prototype Metre Bar', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['International Prototype Metre Bar'],
        red: ['Construction', 'Archery'],
      },
      decks: {
        base: {
          5: ['Coal']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 5)

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'up'
        },
        museum: ['Museum 1', 'International Prototype Metre Bar'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['International Prototype Metre Bar'],
        red: ['Construction', 'Archery'],
      },
      decks: {
        base: {
          3: ['Engineering'],
          10: ['Software'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 3)

    t.testBoard(game,  {
      dennis: {
        red: {
          cards: ['Engineering', 'Construction', 'Archery'],
          splay: 'up',
        },
        score: ['Software'],
        museum: ['Museum 1', 'International Prototype Metre Bar'],
      },
    })

  })
})
