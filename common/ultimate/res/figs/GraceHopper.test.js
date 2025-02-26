Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Grace Hopper', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Grace Hopper'],
        hand: ['Homer', 'Calendar', 'Robotics'],
      },
      decks: {
        base: {
          9: ['Computers']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.blue')

    t.testChoices(request2, ['Homer', 'Calendar', 'Robotics'])

    const request3 = t.choose(game, request2, 'Calendar', 'Robotics')
    const request4 = t.choose(game, request3, 'auto')

    t.testBoard(game, {
      dennis: {
        blue: ['Grace Hopper', 'Calendar'],
        red: ['Robotics'],
        hand: ['Homer', 'Computers']
      },
    })
  })

  test('karma: no share, not blue', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['The Wheel']
      },
      micah: {
        blue: ['Grace Hopper'],
      },
      decks: {
        base: {
          1: ['Tools', 'Archery'],
          10: ['Robotics']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.The Wheel')

    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        hand: ['Tools', 'Archery']
      },
      micah: {
        blue: ['Grace Hopper'],
        hand: ['Robotics']
      }
    })
  })

  test('karma: no share, blue', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['The Wheel']
      },
      micah: {
        blue: ['Grace Hopper'],
      },
      decks: {
        base: {
          1: ['Tools', 'Archery'],
          10: ['Software']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.The Wheel')

    t.testGameOver(request2, 'micah', 'Grace Hopper')
  })

})
