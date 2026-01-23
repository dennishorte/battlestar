Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alex Trebek', () => {
  test('karma: draw with figure in hand, karma does not trigger', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Alex Trebek'], // Age 10, so draws age 10
        hand: ['Homer'], // Has a figure in hand, so karma should NOT trigger
      },
      decks: {
        base: {
          10: ['Robotics'], // Age 10 card to draw normally
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Draw.draw a card')
    // Karma should NOT trigger because dennis has a figure (Homer) in hand

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Alex Trebek'],
        hand: ['Homer', 'Robotics'], // Only normal draw, no karma effect
      },
    })
  })

  test('karma: draw with no figures in hand, search and take figure', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Alex Trebek'], // Age 10, so draws age 10
        hand: ['Tools'], // Has a card but no figures
      },
      decks: {
        base: {
          10: ['Robotics'], // Age 10 card to draw normally
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Draw.draw a card')
    // Karma triggers: no figures in hand, so search for a figure
    request = t.choose(game, 1) // Choose age 1
    // The choices are card IDs with asterisks like "*figs-1*"
    // We need to use the exact string format from the choices array
    request = t.choose(game, 'Homer')

    t.testIsSecondPlayer(game)
    // Verify that Homer was taken into hand by the karma
    t.testBoard(game, {
      dennis: {
        yellow: ['Alex Trebek'],
        hand: ['Homer', 'Tools', 'Robotics'], // Only normal draw, no karma effect
      },
    })
  })
})
