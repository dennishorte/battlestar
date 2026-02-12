const t = require('../../../testutil_v2.js')

describe('Paintbrush', () => {
  test('exchange 1 clay for 2 food during harvest', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['paintbrush-e039'],
        clay: 1,
        pet: 'boar',
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: onHarvest → Paintbrush offers (before feeding)
    t.choose(game, 'Pay 1 clay for 2 food')

    // food: 0 + 2 (DL) + 2 (Paintbrush) = 4 - 4 (feed) = 0
    // clay: 1 - 1 (Paintbrush) = 0
    t.testBoard(game, {
      dennis: {
        food: 0,
        grain: 1,  // from Grain Seeds
        pet: 'boar',
        animals: { boar: 1 },
        minorImprovements: ['paintbrush-e039'],
      },
    })
  })

  test('exchange 1 clay for 1 bonus point during harvest', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['paintbrush-e039'],
        clay: 1,
        food: 4,
        pet: 'boar',
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play 4 actions to reach harvest
    t.choose(game, 'Day Laborer')   // dennis: +2 food → 6
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Harvest: onHarvest → Paintbrush offers
    t.choose(game, 'Pay 1 clay for 1 bonus point')

    // food: 4 + 2 (DL) = 6 - 4 (feed) = 2
    // clay: 1 - 1 (Paintbrush) = 0
    t.testBoard(game, {
      dennis: {
        food: 2,
        grain: 1,  // from Grain Seeds
        bonusPoints: 1,
        pet: 'boar',
        animals: { boar: 1 },
        minorImprovements: ['paintbrush-e039'],
      },
    })
  })
})
