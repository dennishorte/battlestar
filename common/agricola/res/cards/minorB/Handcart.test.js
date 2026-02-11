const t = require('../../../testutil_v2.js')

describe('Handcart', () => {
  test('takes 1 wood from Forest when accumulated >= 6', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['handcart-b081'],
      },
    })
    // Set Forest accumulated to 5 (replenish will add 3 → 8, which is >= 6)
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.actionSpaces['take-wood'].accumulated = 5
    })
    game.run()

    // Work phase starts → onWorkPhaseStart → Handcart offers
    // Forest has 8 wood (5 + 3 replenish) → meets 6 threshold
    t.choose(game, 'Take 1 wood')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Meeting Place')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        // 1 from Handcart + 7 from Forest (8-1=7 remaining after Handcart)
        wood: 8,
        food: 1, // from Meeting Place
        minorImprovements: ['handcart-b081'],
      },
    })
  })

  test('no offer when no accumulation space meets threshold', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['handcart-b081'],
      },
    })
    game.run()

    // Forest has 3 wood (default round 1 accumulation) → below 6 threshold
    // No Handcart offer, go straight to actions
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Meeting Place')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 3, // from Forest only (no Handcart bonus)
        food: 1, // from Meeting Place
        minorImprovements: ['handcart-b081'],
      },
    })
  })
})
