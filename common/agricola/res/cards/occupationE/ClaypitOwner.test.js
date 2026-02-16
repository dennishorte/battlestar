const t = require('../../../testutil_v2.js')

describe('Claypit Owner', () => {
  test('gets 1 food and 1 clay when opponent builds improvement with clay cost via House Redevelopment', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['claypit-owner-e156'],
      },
      micah: {
        roomType: 'wood',
        clay: 4, // 2 for renovation + 2 for Fireplace
        reed: 1, // for renovation
      },
    })
    game.run()

    // Micah takes House Redevelopment: renovate wood -> clay, then build Fireplace (costs 2 clay)
    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Claypit Owner
        clay: 1, // from Claypit Owner
        occupations: ['claypit-owner-e156'],
      },
      micah: {
        roomType: 'clay',
        clay: 0, // 4 - 2 (renovation) - 2 (fireplace)
        reed: 0,
        majorImprovements: ['fireplace-2'],
      },
    })
  })

  test('does not trigger when owner builds improvement with clay cost', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['claypit-owner-e156'],
        roomType: 'wood',
        clay: 4,
        reed: 1,
      },
    })
    game.run()

    // Dennis builds himself — Claypit Owner should NOT trigger
    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        food: 0, // no bonus — self-build
        clay: 0,
        reed: 0,
        roomType: 'clay',
        occupations: ['claypit-owner-e156'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
