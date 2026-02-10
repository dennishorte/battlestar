const t = require('../../../testutil_v2.js')

describe('Ale-Benches', () => {
  test('pay 1 grain for 1 bonus point, other players get 1 food', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        grain: 2,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['ale-benches-a029'],
      },
    })
    game.run()

    // Work phase: 4 workers take simple actions
    t.choose(game, 'Day Laborer')   // dennis turn 1: +2 food
    t.choose(game, 'Forest')    // micah turn 1: +3 wood
    t.choose(game, 'Grain Seeds')   // dennis turn 2: +1 grain
    t.choose(game, 'Clay Pit')  // micah turn 2: +1 clay

    // Return home phase: Ale-Benches triggers
    t.choose(game, 'Pay 1 grain for 1 bonus point')

    t.testBoard(game, {
      dennis: {
        grain: 2,       // 2 + 1 (grain seeds) - 1 (ale benches) = 2
        food: 2,        // 0 + 2 (day laborer) = 2
        bonusPoints: 1,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['ale-benches-a029'],
      },
      micah: {
        wood: 3,        // 0 + 3 (forest) = 3
        clay: 1,        // 0 + 1 (clay pit) = 1
        food: 1,        // 0 + 1 (ale benches) = 1
      },
    })
  })

  test('does not trigger when player has no grain', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['ale-benches-a029'],
      },
    })
    game.run()

    // Work phase: 4 workers take simple actions
    t.choose(game, 'Day Laborer')     // dennis turn 1: +2 food
    t.choose(game, 'Forest')      // micah turn 1: +3 wood
    t.choose(game, 'Reed Bank')   // dennis turn 2: +1 reed
    t.choose(game, 'Clay Pit')    // micah turn 2: +1 clay

    // Return home phase: Ale-Benches does NOT trigger (no grain)
    // Game proceeds directly to next round

    t.testBoard(game, {
      dennis: {
        food: 2,
        reed: 1,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['ale-benches-a029'],
      },
      micah: {
        wood: 3,
        clay: 1,
      },
    })
  })
})
