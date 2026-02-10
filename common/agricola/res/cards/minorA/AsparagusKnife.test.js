const t = require('../../../testutil_v2.js')

describe('Asparagus Knife', () => {
  test('harvests vegetable for food and bonus point in round 8', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 7, // game plays round 8
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['asparagus-knife-a058'],
        wood: 10, // enough to avoid food conversion prompts
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 2 }],
        },
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    // Round 8: all 4 workers take actions
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Fishing')         // dennis
    t.choose(game, 'Clay Pit')        // micah

    // Return home → Asparagus Knife fires → offer to harvest vegetable
    t.choose(game, 'Take 1 vegetable from field for 3 food and 1 bonus point')

    t.testBoard(game, {
      dennis: {
        food: 6, // 2 Day Laborer + 1 Fishing + 3 Asparagus Knife
        wood: 10,
        bonusPoints: 1,
        minorImprovements: ['asparagus-knife-a058'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 1 }],
        },
      },
    })
  })

  test('can skip the asparagus knife offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['asparagus-knife-a058'],
        wood: 10,
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 2 }],
        },
      },
      micah: {
        food: 10,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Fishing')         // dennis
    t.choose(game, 'Clay Pit')        // micah

    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 3, // 2 Day Laborer + 1 Fishing
        wood: 10,
        minorImprovements: ['asparagus-knife-a058'],
        farmyard: {
          fields: [{ row: 0, col: 2, crop: 'vegetables', cropCount: 2 }],
        },
      },
    })
  })
})
