const t = require('../../../testutil_v2.js')

describe('Truffle Slicer', () => {
  test('pay 1 food for 1 bonus point when taking wood with boar', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['truffle-slicer-d039'],
        food: 1,
        pet: 'boar',
      },
    })
    game.run()

    // Dennis uses Forest (wood accumulation) → Truffle Slicer triggers (has boar + food)
    t.choose(game, 'Forest')
    t.choose(game, 'Pay 1 food for 1 bonus point')

    t.testBoard(game, {
      dennis: {
        bonusPoints: 1,
        food: 0,   // 1 - 1 = 0
        wood: 3,   // from Forest (3 wood accumulated)
        pet: 'boar',
        animals: { boar: 1 },
        minorImprovements: ['truffle-slicer-d039'],
      },
    })
  })

  test('does not trigger without boar', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['truffle-slicer-d039'],
        food: 1,
      },
    })
    game.run()

    // Dennis uses Forest but has no boar → no Truffle Slicer offer
    t.choose(game, 'Forest')

    // Next prompt should be micah's action (no Truffle Slicer offer)
    t.testBoard(game, {
      dennis: {
        food: 1,  // unchanged
        wood: 3,  // from Forest
        minorImprovements: ['truffle-slicer-d039'],
      },
    })
  })
})
