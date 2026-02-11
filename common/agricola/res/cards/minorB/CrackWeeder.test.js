const t = require('../../../testutil_v2.js')

describe('Crack Weeder', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['crack-weeder-b058'],
        wood: 1, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Crack Weeder')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Crack Weeder
        minorImprovements: ['crack-weeder-b058'],
      },
    })
  })

  test('gives food for each vegetable harvested', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['crack-weeder-b058'],
        food: 4, // enough to feed 2 family members
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'vegetables', cropCount: 2 },
          ],
        },
      },
      micah: {
        food: 4,
      },
    })
    game.run()

    // Play through round 4 (4 actions)
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Harvest: field phase harvests 1 vegetable (cropCount 2 → 1)
    // Crack Weeder gives 1 food for the 1 vegetable harvested
    // Feeding: 4 food for 2 people
    t.testBoard(game, {
      dennis: {
        grain: 1, // from Grain Seeds
        vegetables: 1, // 1 harvested from field
        food: 3, // 4 + 2 (day laborer) + 1 (crack weeder) - 4 (feeding)
        minorImprovements: ['crack-weeder-b058'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'vegetables', cropCount: 1 }],
        },
      },
    })
  })
})
