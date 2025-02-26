Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Delft Pocket Telescope', () => {

  test('dogma: both match', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Delft Pocket Telescope'],
        score: ['Gunpowder'],
      },
      decks: {
        base: {
          5: ['Coal'],
          6: ['Industrialization'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Coal')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        hand: ['Coal', 'Industrialization'],
      }
    })
  })

  test('dogma: one matches', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Delft Pocket Telescope'],
        score: ['Gunpowder'],
      },
      decks: {
        base: {
          5: ['Statistics'],
          6: ['Industrialization'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        hand: ['Statistics', 'Industrialization'],
      }
    })
  })

  test('dogma: no matches', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Delft Pocket Telescope'],
        score: ['Enterprise', 'Gunpowder'],
      },
      decks: {
        base: {
          5: ['Statistics', 'Coal'],
          6: ['Machine Tools', 'Classification'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Enterprise')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        hand: ['Coal', 'Classification'],
      }
    })
  })
})
