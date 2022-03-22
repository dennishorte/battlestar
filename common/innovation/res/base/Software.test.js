Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Software', () => {
  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        blue: ['Software'],
        hand: ['Gunpowder'],
      },
      decks: {
        base: {
          10: ['The Internet', 'Globalization', 'Stem Cells']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Software')
    const request3 = t.choose(game, request2, 'yes')

    t.testBoard(game, {
      dennis: {
        blue: ['Software'],
        yellow: ['Stem Cells', 'Globalization'],
        score: ['The Internet', 'Gunpowder'],
      },
    })
  })
})
