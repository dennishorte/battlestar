const t = require('../../../testutil_v2.js')

describe('Winnowing Fan', () => {
  test('bakes 1 grain after field phase during harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 3, // game plays round 4 (first harvest)
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['winnowing-fan-a061'],
        majorImprovements: ['fireplace-2'], // bakingRate: 2 (1 grain → 2 food)
        grain: 2,
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Round 4: all 4 workers
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Fishing')         // dennis
    t.choose(game, 'Clay Pit')        // micah

    // Harvest → Field Phase → onFieldPhaseEnd → Winnowing Fan fires
    t.choose(game, 'Bake 1 grain for 2 food using Fireplace')

    t.testBoard(game, {
      dennis: {
        food: 11, // 10 + 2 (Day Laborer) + 1 (Fishing) + 2 (Winnowing Fan) - 4 (feed)
        grain: 1, // 2 - 1 (Winnowing Fan)
        minorImprovements: ['winnowing-fan-a061'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('can skip winnowing fan offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['winnowing-fan-a061'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
        food: 10,
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Fishing')
    t.choose(game, 'Clay Pit')

    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 9, // 10 + 2 (Day Laborer) + 1 (Fishing) - 4 (feed)
        grain: 2, // unchanged
        minorImprovements: ['winnowing-fan-a061'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
