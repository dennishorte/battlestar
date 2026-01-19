Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Coal')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Coal', 'Industrialization'],
        museum: ['Museum 1', 'Delft Pocket Telescope'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Statistics', 'Industrialization'],
        museum: ['Museum 1', 'Delft Pocket Telescope'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Enterprise')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Coal', 'Classification'],
        museum: ['Museum 1', 'Delft Pocket Telescope'],
      }
    })
  })
})
