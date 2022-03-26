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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 5)

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Construction', 'Archery'],
          splay: 'up'
        }
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
          3: ['Engineering']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 3)

    t.testGameOver(request3, 'dennis', 'International Prototype Metre Bar')
  })
})
