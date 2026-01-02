Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bear Grylls', () => {
  test('karma: When you meld this card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Canning'],
        hand: ['Bear Grylls'],
      },
      micah: {
        green: ['Paper', 'Sailing'],
        hand: ['Machinery'],
      },
      decks: {
        base: {
          0: ['Fresh Water'],
        }
      },
    })

    let request = game.run()
    request = t.choose(game, request, 'Meld.Bear Grylls')

    t.testBoard(game, {
      dennis: {
        hand: ['Fresh Water'],
      }
    })
  })
})
