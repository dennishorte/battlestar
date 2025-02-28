Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("GPS", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['GPS'],
        yellow: ['Agriculture', 'Canning'],
      },
      micah: {
        forecast: ['Tools'],
      },
      decks: {
        base: {
          10: ['Software', 'Robotics', 'Self Service'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.GPS')
    const request3 = t.choose(game, request2, 'yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['GPS'],
        yellow: {
          cards: ['Agriculture', 'Canning'],
          splay: 'up'
        },
        forecast: ['Software', 'Robotics', 'Self Service'],
      },
    })
  })
})
