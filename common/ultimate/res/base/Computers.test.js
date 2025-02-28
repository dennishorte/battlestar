Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Computers', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Computers'],
        red: ['Engineering', 'Archery'],
        hand: ['Gunpowder'],
      },
      decks: {
        base: {
          10: ['Stem Cells'],
          11: ['Fusion'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Computers')
    const request3 = t.choose(game, request2, 'red')
    const request4 = t.choose(game, request3, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Computers'],
        yellow: ['Stem Cells'],
        red: {
          cards: ['Engineering', 'Archery'],
          splay: 'up'
        },
        hand: ['Fusion'],
        score: ['Gunpowder'],
      },
    })
  })

})
