const t = require('../../../testutil_v2.js')

describe('Turnip Farmer', () => {
  // Card is 3+ players. onReturnHomeStart: +1 vegetable if both Day Laborer and Grain Seeds are occupied.
  test('onReturnHomeStart gives 1 vegetable when both Day Laborer and Grain Seeds are occupied', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['turnip-farmer-a141'],
        vegetables: 0,
      },
    })
    game.run()

    // Round 2 work phase - 6 turns (3 players × 2 workers). Both spaces must be occupied.
    t.choose(game, 'Forest')        // dennis turn 1
    t.choose(game, 'Day Laborer')  // micah turn 1
    t.choose(game, 'Grain Seeds')   // scott turn 1
    t.choose(game, 'Clay Pit')     // dennis turn 2
    t.choose(game, 'Reed Bank')    // micah turn 2
    t.choose(game, 'Fishing')      // scott turn 2

    // Return home → Turnip Farmer: both occupied → +1 vegetable for dennis

    t.testBoard(game, {
      dennis: {
        occupations: ['turnip-farmer-a141'],
        vegetables: 1,
        wood: 3,
        clay: 1,
      },
    })
  })

  test('onReturnHomeStart gives no vegetable when only one space is occupied', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['turnip-farmer-a141'],
        vegetables: 0,
      },
    })
    game.run()

    // Only Day Laborer occupied; Grain Seeds never taken
    t.choose(game, 'Forest')        // dennis turn 1
    t.choose(game, 'Day Laborer')   // micah turn 1
    t.choose(game, 'Clay Pit')      // scott turn 1
    t.choose(game, 'Reed Bank')     // dennis turn 2
    t.choose(game, 'Fishing')       // micah turn 2
    t.choose(game, 'Hollow')        // scott turn 2

    // Return home → Day Laborer occupied, Grain Seeds not → no vegetable

    t.testBoard(game, {
      dennis: {
        occupations: ['turnip-farmer-a141'],
        vegetables: 0,
        wood: 3,
        reed: 1,
      },
    })
  })
})
