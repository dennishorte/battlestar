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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.GPS')
    request = t.choose(game, request, 'yellow')

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
