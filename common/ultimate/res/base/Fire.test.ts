Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Fire', () => {
  test('dogma: demand - opponent reveals age 0 card of color not on board', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Fire'],
        blue: ['Curing'], // Blue is on dennis's board
        hand: ['Tools'],
      },
      micah: {
        hand: ['Fishing'], // Age 0, green (not on dennis's board)
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fire')
    // Demand effect: Micah must reveal Fishing (age 0, green, not on dennis's board)
    // If only one valid choice, it auto-selects; otherwise micah chooses
    // After demand, second effect (meld) runs for dennis

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Fire'],
        blue: ['Tools', 'Curing'],
      },
      micah: {
        hand: ['Fishing'], // Revealed but stays in hand
      },
    })
  })

  test('dogma: demand - opponent reveals age 1 card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Fire'],
        blue: ['Curing'],
        hand: ['Calendar'],
      },
      micah: {
        hand: ['Tools'], // Age 0, yellow (not on dennis's board) - valid to reveal
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fire')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Fire'],
        blue: ['Calendar', 'Curing'],
      },
      micah: {
        hand: ['Tools'], // Revealed but stays in hand
      },
    })
  })

  test('dogma: demand - opponent loses (only has cards of colors on board)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Fire'],
      },
      micah: {
        hand: ['Stone Knives'], // No valid cards to reveal
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fire')
    // Micah has no valid age 0 cards to reveal (empty hand)
    // So micah loses, then second effect (meld) runs for dennis

    t.testGameOver(request, 'dennis', 'Fire') // Dennis wins when Micah loses
  })

  test('dogma: meld - player loses (no card of color on board)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Fire'],
        blue: ['Curing'], // Only blue on board
        hand: ['Sailing'],
      },
      micah: {
        hand: ['Agriculture'], // Age 0, yellow (not on dennis's board) - can reveal to satisfy demand
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fire')
    // First effect: demand - micah reveals Agriculture (auto-selects if only one choice)
    // Second effect: meld - no blue card in hand, so player loses

    t.testGameOver(request, 'micah', 'Fire') // Micah wins when Dennis loses
  })
})
