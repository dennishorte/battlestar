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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.blue')

    t.testChoices(request, ['Homer', 'Calendar', 'Robotics'])

    request = t.choose(game, request, 'Calendar', 'Robotics')
    request = t.choose(game, request, 'auto')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Wheel')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Wheel')

    t.testGameOver(request, 'micah', 'Grace Hopper')
  })

})
