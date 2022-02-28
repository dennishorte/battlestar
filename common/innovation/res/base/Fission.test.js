Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Fission', () => {

  test('dogma (nuclear war)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Fission'],
        achievements: ['The Wheel'],
        score: ['Code of Laws'],
      },
      micah: {
        green: {
          cards: ['Navigation', 'Mapmaking'],
          splay: 'left'
        },
        hand: ['Tools', 'Agriculture']
      },
      decks: {
        base: {
          10: ['Robotics'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fission')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        achievements: ['The Wheel'],
      },
    })
  })

  test('dogma (safe)', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Fission'],
        achievements: ['The Wheel'],
        score: ['Code of Laws'],
      },
      micah: {
        green: {
          cards: ['Navigation', 'Mapmaking'],
          splay: 'left'
        },
        hand: ['Tools', 'Agriculture']
      },
      decks: {
        base: {
          10: ['Software', 'Robotics']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fission')
    const request3 = t.choose(game, request2, 'Navigation')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Fission'],
        achievements: ['The Wheel'],
        score: ['Code of Laws'],
        hand: ['Robotics'],
      },
      micah: {
        green: ['Mapmaking'],
        hand: ['Tools', 'Agriculture', 'Software']
      },
    })
  })

})
