Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Beauvais Cathedral Clock', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Beauvais Cathedral Clock'],
        red: ['Coal', 'Construction'],
      },
      decks: {
        base: {
          4: ['Gunpowder'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Coal', 'Construction'],
          splay: 'right'
        },
        hand: ['Gunpowder'],
      }
    })
  })
})
