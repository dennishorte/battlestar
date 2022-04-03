Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Plush Beweglich Rod Bear", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Plush Beweglich Rod Bear"],
        blue: ['Computers', 'Tools'],
        red: ['Flight', 'Archery'],
        yellow: ['Canning', 'Agriculture'],
        green: ['Satellites', 'Sailing'],
        score: ['Suburbia', 'Robotics'],
      },
      micah: {
        purple: ['Specialization', 'Code of Laws'],
        score: ['Fission', 'Socialism']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 9)
    const request4 = t.choose(game, request3, 'auto')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        blue: {
          cards: ['Computers', 'Tools'],
          splay: 'up'
        },
        red: ['Flight', 'Archery'],
        yellow: ['Canning', 'Agriculture'],
        green: {
          cards: ['Satellites', 'Sailing'],
          splay: 'up'
        },
        score: ['Robotics'],
      },
      micah: {
        purple: ['Specialization', 'Code of Laws'],
        score: ['Socialism']
      }
    })
  })
})
