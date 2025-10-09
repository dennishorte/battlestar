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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 9)
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
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
        museum: ['Museum 1', 'Plush Beweglich Rod Bear'],
      },
      micah: {
        purple: ['Specialization', 'Code of Laws'],
        score: ['Socialism']
      }
    })
  })
})
