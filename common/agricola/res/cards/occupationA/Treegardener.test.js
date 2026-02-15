const t = require('../../../testutil_v2.js')

describe('Treegardener', () => {
  test('onFieldPhase gives 1 wood and offers to buy more; skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['treegardener-a118'],
        food: 8,
        wood: 0,
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Field phase: Treegardener gives 1 wood, then offers buy (we skip)
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['treegardener-a118'],
        wood: 1,
        food: 6, // 8 + 2 (Day Laborer) - 4 (feeding)
        grain: 1,
      },
    })
  })

  test('onFieldPhase buy 1 wood for 1 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['treegardener-a118'],
        food: 8,
        wood: 0,
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.choose(game, 'Buy 1 wood for 1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['treegardener-a118'],
        wood: 2, // 1 free + 1 bought
        food: 5, // 8 + 2 - 4 (feeding) - 1 (buy wood)
        grain: 1,
      },
    })
  })

  test('onFieldPhase buy 2 wood for 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['treegardener-a118'],
        food: 10,
        wood: 0,
      },
      micah: { food: 8 },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.choose(game, 'Buy 2 wood for 2 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['treegardener-a118'],
        wood: 3, // 1 free + 2 bought
        food: 6, // 10 + 2 (Day Laborer) - 2 (buy wood) - 4 (feeding)
        grain: 1,
      },
    })
  })

  test('onFieldPhase does not offer buy when player has no food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['treegardener-a118'],
        food: 0,
        wood: 0,
      },
      micah: { food: 8 },
    })
    game.run()

    // Dennis takes only accumulation (no Day Laborer) so 0 food at field phase
    t.choose(game, 'Forest')
    t.choose(game, 'Clay Pit')
    t.choose(game, 'Reed Bank')
    t.choose(game, 'Grain Seeds')

    // No offer (food < 1); just get 1 wood. Feeding may add begging.
    t.testBoard(game, {
      dennis: {
        occupations: ['treegardener-a118'],
        wood: 1 + 3, // 1 from tree gardener + 3 from forest
        reed: 1,
        beggingCards: 4,
      },
    })
  })
})
