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

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Computers')
    request = t.choose(game, 'red')
    request = t.choose(game, 'yes')

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
