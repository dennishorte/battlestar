Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Shennong', () => {
  test('karma does not trigger on other player turn', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'],
      },
      micah: {
        yellow: ['Shennong'],
        hand: ['Construction', 'The Wheel', 'Fermenting', 'Code of Laws'],
      },
      decks: {
        base: {
          1: ['Metalworking'],
        }
      }
    })

    // dennis dogmas Archery: "Draw a {1}. I demand you transfer the highest
    // card in your hand to my hand!"
    // micah shares the draw — draws Metalworking (a 1).
    // Shennong should NOT trigger because it's dennis's turn, not micah's.
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Archery')

    // Verify micah has no score cards — Shennong did NOT trigger
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
      },
      micah: {
        yellow: ['Shennong'],
        hand: ['Code of Laws', 'Construction', 'Fermenting', 'Metalworking', 'The Wheel'],
      },
    })
  })

  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Shennong'],
        hand: ['Construction', 'The Wheel', 'Fermenting', 'Code of Laws'],
      },
      decks: {
        base: {
          1: ['Metalworking'],
          2: ['Calendar'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Draw.draw a card')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Shennong'],
        hand: ['Construction', 'The Wheel', 'Fermenting', 'Code of Laws', 'Metalworking'],
        score: ['Calendar'],
      },
    })
  })
})
