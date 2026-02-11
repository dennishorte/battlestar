const t = require('../../../testutil_v2.js')

describe('Lasso', () => {
  test('animal market first, then any action (Scenario 1)', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Sheep Market'],
      dennis: {
        minorImprovements: ['lasso-b024'],
      },
    })
    game.run()

    // Dennis: takes Sheep Market → Lasso offers bonus turn → accepts → takes Forest
    // This uses both workers, so Dennis is done for the round
    t.choose(game, 'Sheep Market')
    t.choose(game, 'Use Lasso')
    t.choose(game, 'Forest')
    // Micah: action 1
    t.choose(game, 'Day Laborer')
    // Dennis: no workers left → skip
    // Micah: action 2
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        pet: 'sheep',
        animals: { sheep: 1 },
        wood: 3,
        minorImprovements: ['lasso-b024'],
      },
    })
  })

  test('non-animal-market first, then animal market (Scenario 2)', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Sheep Market'],
      dennis: {
        minorImprovements: ['lasso-b024'],
      },
    })
    game.run()

    // Dennis: takes Forest → Lasso offers bonus (restricted to animal markets) → accepts
    // Sheep Market is the only animal market → auto-selected
    t.choose(game, 'Forest')
    t.choose(game, 'Use Lasso')
    // Micah: action 1
    t.choose(game, 'Day Laborer')
    // Dennis: no workers left → skip
    // Micah: action 2
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        pet: 'sheep',
        animals: { sheep: 1 },
        minorImprovements: ['lasso-b024'],
      },
    })
  })

  test('not offered when no workers remain', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Sheep Market'],
      dennis: {
        minorImprovements: ['lasso-b024'],
      },
    })
    game.run()

    // Dennis: action 1 — Forest → Lasso offers (non-animal, Sheep Market available) → Skip
    t.choose(game, 'Forest')
    t.choose(game, 'Skip')
    // Micah: action 1
    t.choose(game, 'Day Laborer')
    // Dennis: action 2 (last worker) — Sheep Market → Lasso NOT offered (no workers left)
    t.choose(game, 'Sheep Market')
    // Micah: action 2
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        pet: 'sheep',
        animals: { sheep: 1 },
        minorImprovements: ['lasso-b024'],
      },
    })
  })

  test('not offered when no valid animal market targets', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: ['Sheep Market'],
      dennis: {
        minorImprovements: ['lasso-b024'],
      },
    })
    game.run()

    // Micah: takes Sheep Market (occupies the only animal market)
    t.choose(game, 'Sheep Market')
    // Dennis: takes Forest — Lasso wants animal market but none available → NOT offered
    t.choose(game, 'Forest')
    // Micah: action 2
    t.choose(game, 'Day Laborer')
    // Dennis: action 2
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        clay: 1,
        minorImprovements: ['lasso-b024'],
      },
    })
  })
})
