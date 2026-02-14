const t = require('../../../testutil_v2.js')

describe('Catcher', () => {
  test('onPlacePerson grants 1 food when 1st person on space with exactly 5 building resources', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Western Quarry', accumulated: 5 }],
      dennis: {
        occupations: ['catcher-a107'],
        food: 0,
      },
    })
    game.run()

    // First person (dennis) takes Western Quarry with exactly 5 stone
    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        occupations: ['catcher-a107'],
        food: 1, // 1 food from Catcher (1st person, exactly 5 resources)
        stone: 5, // 5 from accumulation
      },
    })
  })

  test('onPlacePerson grants 1 food when 2nd person on space with exactly 4 building resources', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Western Quarry', accumulated: 4 }],
      dennis: {
        occupations: ['catcher-a107'],
        food: 0,
        familyMembers: 2, // Start with 2 workers
      },
    })
    game.run()

    // dennis takes Day Laborer first (1st person he places) - no trigger
    t.choose(game, 'Day Laborer')
    // micah takes an action (work phase rotates)
    t.choose(game, 'Forest')
    // dennis takes Western Quarry second (2nd person he places) - gets 4 stone, Catcher triggers
    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        occupations: ['catcher-a107'],
        food: 3, // 1 from Catcher (2nd person, exactly 4 resources) + 2 from Day Laborer
        stone: 4, // 4 from Western Quarry
      },
    })
  })

  test('does not grant food if resource count does not match person number', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Western Quarry', accumulated: 3 }],
      dennis: {
        occupations: ['catcher-a107'],
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        occupations: ['catcher-a107'],
        food: 0, // No food (3 resources ≠ 5 for 1st person)
        stone: 3, // 3 from accumulation
      },
    })
  })
})
