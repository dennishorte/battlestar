Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mass Media', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        green: ['Mass Media'],
        hand: ['Tools'],
        score: ['Fermenting', 'Canning'],
      },
      micah: {
        score: ['Atomic Theory', 'Experimentation', 'Emancipation'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Mass Media')
    const request3 = t.choose(game, request2, 'Tools')
    const request4 = t.choose(game, request3, 6)
    const request5 = t.choose(game, request4, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Mass Media'],
        score: ['Fermenting'],
      },
      micah: {
        score: ['Experimentation'],
      }
    })
  })
})
