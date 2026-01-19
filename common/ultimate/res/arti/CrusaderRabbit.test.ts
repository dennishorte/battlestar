Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Crusader Rabbit", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Crusader Rabbit"],
        red: ['Archery'],
      },
      micah: {
        red: ['Construction', 'Oars', 'Coal'],
        green: ['The Wheel'],
        purple: ['Feudalism'],
        blue: ['Pottery'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          10: ['Software', 'Robotics'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Oars', 'Coal', 'Archery', 'Feudalism'],
        hand: ['Robotics', 'Sailing'],
        museum: ['Museum 1', 'Crusader Rabbit'],
      },
      micah: {
        green: ['The Wheel'],
        blue: ['Pottery'],
        score: ['Construction'],
        hand: ['Software'],
      },
    })
  })
})
