const t = require('../../../testutil_v2.js')

describe('Wood Harvester', () => {
  test('onFieldPhase gives 1 wood for wood space with exactly 2 wood', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 4, // First harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wood-harvester-a104'],
        food: 8,
        wood: 0,
      },
      micah: { food: 8 },
    })
    // Set Forest to have exactly 2 wood after replenish
    game.testSetBreakpoint('replenish-complete', (game) => {
      if (game.state.round === 4) {
        const forestSpace = game.state.actionSpaces['take-wood']
        if (forestSpace) {
          forestSpace.accumulated = 2
        }
      }
    })
    game.run()

    // Play through all 4 actions (2 players × 2 workers)
    // Don't take Forest so it still has accumulated wood during field phase
    t.choose(game, 'Day Laborer')  // dennis turn 1
    t.choose(game, 'Clay Pit')     // micah turn 1
    t.choose(game, 'Grain Seeds')  // dennis turn 2
    t.choose(game, 'Reed Bank')    // micah turn 2

    // Harvest: field phase → onFieldPhase fires
    // Forest still has 2 wood (not taken) → +1 wood
    // Feeding: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        wood: 1, // 0 + 1 (Wood Harvester: 1 space with exactly 2 wood)
        grain: 1, // 0 + 1 (Grain Seeds)
        food: 6,  // 8 + 2 (Day Laborer) - 4 (feeding)
        occupations: ['wood-harvester-a104'],
      },
    })
  })

  test('onFieldPhase gives 1 food for wood space with at least 3 wood', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 4, // First harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wood-harvester-a104'],
        food: 8,
        wood: 0,
      },
      micah: { food: 8 },
    })
    // Set Forest to have 3 wood after replenish
    game.testSetBreakpoint('replenish-complete', (game) => {
      if (game.state.round === 4) {
        const forestSpace = game.state.actionSpaces['take-wood']
        if (forestSpace) {
          forestSpace.accumulated = 3
        }
      }
    })
    game.run()

    // Play through all 4 actions
    // Don't take Forest so it still has accumulated wood during field phase
    t.choose(game, 'Day Laborer')  // dennis turn 1
    t.choose(game, 'Clay Pit')     // micah turn 1
    t.choose(game, 'Grain Seeds')  // dennis turn 2
    t.choose(game, 'Reed Bank')    // micah turn 2

    // Harvest: field phase → onFieldPhase fires
    // Forest still has 3 wood (not taken) → +1 food
    // Feeding: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        wood: 0, // No change
        grain: 1, // 0 + 1 (Grain Seeds)
        food: 7,  // 8 + 2 (Day Laborer) + 1 (Wood Harvester) - 4 (feeding)
        occupations: ['wood-harvester-a104'],
      },
    })
  })

  test('onFieldPhase gives nothing when wood space has less than 2 wood', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 4, // First harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['wood-harvester-a104'],
        food: 8,
        wood: 0,
      },
      micah: { food: 8 },
    })
    // Set Forest to have 1 wood after replenish
    game.testSetBreakpoint('replenish-complete', (game) => {
      if (game.state.round === 4) {
        const forestSpace = game.state.actionSpaces['take-wood']
        if (forestSpace) {
          forestSpace.accumulated = 1
        }
      }
    })
    game.run()

    // Play through all 4 actions
    // Don't take Forest so it still has accumulated wood during field phase
    t.choose(game, 'Day Laborer')  // dennis turn 1
    t.choose(game, 'Clay Pit')     // micah turn 1
    t.choose(game, 'Grain Seeds')  // dennis turn 2
    t.choose(game, 'Reed Bank')    // micah turn 2

    // Harvest: field phase → onFieldPhase fires
    // Forest still has 1 wood (< 2, not taken) → no bonus
    // Feeding: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        wood: 0, // No change
        grain: 1, // 0 + 1 (Grain Seeds)
        food: 6,  // 8 + 2 (Day Laborer) - 4 (feeding)
        occupations: ['wood-harvester-a104'],
      },
    })
  })
})
