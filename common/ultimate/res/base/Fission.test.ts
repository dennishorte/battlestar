Error.stackTraceLimit = 100

import t from '../../testutil.js'

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fission')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fission')
    request = t.choose(game, request, 'Navigation')

    t.testIsSecondPlayer(game)
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
