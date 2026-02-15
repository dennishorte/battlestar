const t = require('../../../testutil_v2.js')

describe('Pattern Maker', () => {
  // Card text: "Each time another player renovates, you can exchange exactly
  // 2 wood for 1 grain, 1 food, and 1 bonus point."

  test('exchanges 2 wood for grain, food, BP when another player renovates', () => {
    // micah renovates wood→clay, triggering PatternMaker for dennis
    // Renovation wood→clay costs 1 clay + 1 reed per room (2 rooms)
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['pattern-maker-c153'],
        wood: 3,
        food: 0,
      },
      micah: {
        roomType: 'wood',
        clay: 2,
        reed: 1,
        food: 10,
      },
    })
    game.run()

    // micah renovates
    t.choose(game, 'House Redevelopment')
    // dennis gets Pattern Maker prompt
    t.choose(game, 'Exchange 2 wood for 1 grain, 1 food, 1 BP')

    t.testBoard(game, {
      dennis: {
        occupations: ['pattern-maker-c153'],
        wood: 1,
        grain: 1,
        food: 1,
        bonusPoints: 1,
      },
      micah: {
        roomType: 'clay',
        food: 10,
      },
    })
  })

  test('does not trigger when owner renovates', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pattern-maker-c153'],
        roomType: 'wood',
        clay: 2,
        reed: 1,
        wood: 5,
        food: 10,
      },
    })
    game.run()

    // dennis renovates himself - Pattern Maker should NOT trigger
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['pattern-maker-c153'],
        roomType: 'clay',
        wood: 5,
        grain: 0,
        food: 10,
      },
    })
  })
})
