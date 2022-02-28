Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mobility', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Mobility'],
        yellow: ['Canning'],
        green: ['Electricity'],
      },
      micah: {
        red: ['Robotics'],
        purple: ['Specialization', 'Railroad'],
        green: ['Metric System'],
        yellow: ['Stem Cells'],
      },
      decks: {
        base: {
          8: ['Skyscrapers'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Mobility')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Mobility'],
        yellow: ['Canning'],
        green: ['Electricity'],
        score: ['Specialization', 'Railroad'],
      },
      micah: {
        red: ['Robotics'],
        green: ['Metric System'],
        yellow: ['Stem Cells'],
        hand: ['Skyscrapers'],
      },
    })
  })
})
