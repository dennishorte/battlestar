Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Battleship Bismark', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Battleship Bismark'],
      },
      micah: {
        red: ['Coal', 'Gunpowder']
      },
      decks: {
        base: {
          8: ['Flight']
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      micah: {
        hand: ['Flight']
      },
    })
  })
})
