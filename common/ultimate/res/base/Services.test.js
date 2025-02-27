Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Services', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        purple: ['Services'],
        blue: ['Computers', 'Tools'],
        green: ['Metric System'],
        yellow: ['Canning'],
      },
      micah: {
        score: ['Skyscrapers', 'Quantum Theory', 'Atomic Theory']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Services')
    const request3 = t.choose(game, request2, 8)
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'Computers')

    t.testIsSecondPlayer(request5)
    t.testBoard(game, {
      dennis: {
        purple: ['Services'],
        blue: ['Tools'],
        green: ['Metric System'],
        yellow: ['Canning'],
        hand: ['Skyscrapers', 'Quantum Theory'],
      },
      micah: {
        hand: ['Computers'],
        score: ['Atomic Theory'],
      }
    })
  })
})
