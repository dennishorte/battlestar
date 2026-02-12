const t = require('../../../testutil_v2.js')

describe('Sundial', () => {
  test('offer sow action at end of work phase in round 7', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['sundial-e026'],
        grain: 2,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis: grain 2+1=3
    t.choose(game, 'Clay Pit')      // micah

    // Work phase ends → Sundial triggers (round 7)
    t.choose(game, 'Take a Sow action')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.action(game, 'sow-field', { row: 0, col: 3, cropType: 'grain' })

    // Harvest: each field 3→2 (harvests 1 each → 2 grain), grain: 1+2=3
    // Feeding: 10+2(DL)-4(feed)=8
    t.testBoard(game, {
      dennis: {
        grain: 3,
        food: 8,
        minorImprovements: ['sundial-e026'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
            { row: 0, col: 3, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
  })

  test('does not trigger in non-qualifying rounds', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['sundial-e026'],
        grain: 2,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 4 actions
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // No Sundial prompt (round 4, not 7 or 9)
    // Harvest: no sown fields, just feeding
    t.testBoard(game, {
      dennis: {
        grain: 3,   // 2 + 1(GS)
        food: 8,    // 10 + 2(DL) - 4(feed)
        minorImprovements: ['sundial-e026'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})
