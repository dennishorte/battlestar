const t = require('../../../testutil_v2.js')

describe('Straw Hat', () => {
  test('gives 1 food when choosing not to move', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['straw-hat-e010'],
        food: 5,
      },
      micah: { food: 5 },
    })
    game.run()

    // Round 3 — 4 actions
    t.choose(game, 'Farmland')      // dennis: plow field
    t.choose(game, '0,2')           // pick field location
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Fishing')       // micah

    // Work phase ends → Straw Hat fires (round 3)
    // dennis chooses to get 1 food instead of moving
    t.choose(game, 'Get 1 food')

    t.testBoard(game, {
      dennis: {
        food: 8,   // 5 + 2 (Day Laborer) + 1 (Straw Hat)
        minorImprovements: ['straw-hat-e010'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('moves person from Farmland to unoccupied action space', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 3,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['straw-hat-e010'],
        food: 5,
      },
      micah: { food: 5 },
    })
    game.run()

    // Round 3 — 4 actions
    t.choose(game, 'Farmland')      // dennis: plow field
    t.choose(game, '0,2')           // pick field location
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Fishing')       // micah

    // Work phase ends → Straw Hat fires (round 3)
    // dennis chooses to move from Farmland
    t.choose(game, 'Move from Farmland')
    // dennis selects Reed Bank (1 reed accumulated per round, 3 rounds so far)
    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      dennis: {
        food: 7,    // 5 + 2 (Day Laborer)
        reed: 1,    // accumulated this round
        minorImprovements: ['straw-hat-e010'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})
