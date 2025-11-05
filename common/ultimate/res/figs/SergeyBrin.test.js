Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sergey Brin', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Sergey Brin', 'The Wheel'],
        blue: ['Computers', 'Experimentation'],
      },
      decks: {
        base: {
          10: ['Robotics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')
    request = t.choose(game, request, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Sergey Brin', 'The Wheel'],
        blue: {
          cards: ['Computers', 'Experimentation'],
          splay: 'up'
        },
        hand: ['Robotics'],
      },
    })
  })

  test('karma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Sergey Brin'],
        blue: ['Computers'],
      },
      micah: {
        red: ['Robotics'],
        purple: ['Enterprise'],
        green: ['Satellites'],
      }
    })

    let request
    request = game.run()

    t.testActionChoices(request, 'Dogma', ['Computers', 'Robotics', 'Enterprise', 'Satellites', 'Sergey Brin'])
  })
})
