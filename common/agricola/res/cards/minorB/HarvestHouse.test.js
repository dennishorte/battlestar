const t = require('../../../testutil_v2.js')

describe('Harvest House', () => {
  test('gives resources when completedHarvests equals occupations + 1 (counting itself)', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    // Round 5: completedHarvestCount = 1 (round 4), occupations = 0, +1 for self → match
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['harvest-house-b071'],
        wood: 1, clay: 1, reed: 1, // card cost
      },
    })
    game.run()

    // Play Harvest House → harvests(1) == occupations(0+1) → bonus
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Harvest House')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Harvest House
        grain: 1, // from Harvest House
        vegetables: 1, // from Harvest House
        wood: 3, // 1 - 1 (cost) + 3 (Forest)
        minorImprovements: ['harvest-house-b071'],
      },
    })
  })

  test('no bonus when completedHarvests does not equal occupations + 1', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    // Round 1: completedHarvestCount = 0, occupations = 0, +1 for self = 1 → no match
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['harvest-house-b071'],
        wood: 1, clay: 1, reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Harvest House')
    // Micah
    t.choose(game, 'Day Laborer')
    // Dennis
    t.choose(game, 'Forest')
    // Micah
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 1, // 1 from Meeting Place only (no Harvest House bonus)
        wood: 3, // 1 - 1 (cost) + 3 (Forest)
        minorImprovements: ['harvest-house-b071'],
      },
    })
  })
})
