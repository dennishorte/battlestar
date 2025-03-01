Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Seikilos Epitaph", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Seikilos Epitaph"],
        green: ['Sailing'],
      },
      decks: {
        base: {
          1: ['Tools'],
          3: ['Compass'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Sailing', 'Compass'],
        blue: ['Tools'],
      },
    })
  })

  test('dogma: only card of color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Seikilos Epitaph"],
        blue: {
          cards: ['Calendar', 'Tools'],
          splay: 'left'
        },
      },
      decks: {
        base: {
          3: ['Paper'],
          4: ['Gunpowder'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        blue: {
          cards: ['Calendar', 'Tools'],
          splay: 'left'
        },
        hand: ['Gunpowder'],
      },
    })
  })
})
