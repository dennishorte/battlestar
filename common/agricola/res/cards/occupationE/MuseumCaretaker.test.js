const t = require('../../../testutil_v2.js')

describe('Museum Caretaker', () => {
  test('gives 1 bonus point at work phase start with all 6 resource types', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['museum-caretaker-e100'],
        wood: 1,
        clay: 1,
        reed: 1,
        stone: 1,
        grain: 1,
        vegetables: 1,
      },
    })
    game.run()

    // onWorkPhaseStart fires at start of round 2 → bonus point
    t.testBoard(game, {
      dennis: {
        bonusPoints: 1,
        wood: 1,
        clay: 1,
        reed: 1,
        stone: 1,
        grain: 1,
        vegetables: 1,
        occupations: ['museum-caretaker-e100'],
      },
    })
  })

  test('does not give bonus point when missing a resource type', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['museum-caretaker-e100'],
        wood: 1,
        clay: 1,
        reed: 1,
        stone: 1,
        grain: 1,
        // no vegetables
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        bonusPoints: 0,
        wood: 1,
        clay: 1,
        reed: 1,
        stone: 1,
        grain: 1,
        occupations: ['museum-caretaker-e100'],
      },
    })
  })
})
