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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      micah: {
        hand: ['Flight']
      },
    })
  })
})
