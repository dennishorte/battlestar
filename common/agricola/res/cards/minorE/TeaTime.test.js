const t = require('../../../testutil_v2.js')

describe('Tea Time', () => {
  test('returns worker from Grain Utilization for placement later', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        hand: ['tea-time-e003'],
        food: 2,
        grain: 1,
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
    game.run()

    // Turn 1: dennis takes Grain Utilization → sow 1 grain
    t.choose(game, 'Grain Utilization')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })

    // Turn 2: micah takes Forest
    t.choose(game, 'Forest')

    // Turn 3: dennis takes Meeting Place → plays Tea Time (cost: 1 food)
    // Tea Time returns worker from Grain Utilization → dennis has 1 extra worker
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Tea Time')

    // Turn 4: micah takes Day Laborer
    t.choose(game, 'Day Laborer')

    // Turn 5: dennis places returned worker on Fishing
    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        // grain: 0  (1 - 1 sowed)
        food: 3,    // 2 - 1 (Tea Time cost) + 1 (Meeting Place) + 1 (Fishing round 2)
        minorImprovements: ['tea-time-e003'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
          ],
        },
      },
    })
  })
})
