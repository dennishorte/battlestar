Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Socialism', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        purple: ['Socialism'],
        hand: ['Code of Laws', 'The Wheel', 'Clothing']
      },
      micah: {
        hand: ['Empiricism', 'Calendar', 'Fermenting']
      },
      scott: {
        hand: ['Software', 'Robotics']
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Socialism')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3, 'The Wheel')
    const request5 = t.choose(game, request4, 'auto')
    const request6 = t.choose(game, request5, 'auto')

    t.testBoard(game, {
      dennis: {
        purple: ['Socialism', 'Code of Laws'],
        green: ['The Wheel', 'Clothing'],
        hand: ['Calendar', 'Fermenting', 'Software', 'Robotics'],
      },
      micah: {
        hand: ['Empiricism'],
      }
    })
  })
})
