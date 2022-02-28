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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')
    const request3 = t.choose(game, request2, 'blue')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()

    t.testActionChoices(request1, 'Dogma', ['Computers', 'Robotics', 'Enterprise', 'Satellites'])
  })
})
