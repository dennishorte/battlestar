const t = require('../../../testutil_v2.js')

describe('Caravan', () => {
  test('provides room enabling family growth beyond room count', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['caravan-b010'],
        food: 10,
      },
      micah: { food: 10 },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // Dennis has 2 rooms + Caravan (providesRoom) = capacity 3, family 2 → can grow
    t.choose(game, 'Basic Wish for Children')

    t.testBoard(game, {
      dennis: {
        familyMembers: 3,
        food: 10,
        minorImprovements: ['caravan-b010'],
      },
    })
  })

  test('family growth fails without caravan when at room limit', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        familyMembers: 2,
        food: 10,
      },
      micah: { food: 10 },
      actionSpaces: ['Basic Wish for Children'],
    })
    game.run()

    // Without Caravan: 2 rooms, 2 family → no room for growth
    // Basic Wish requires room capacity > family size
    // Dennis should not be able to choose this action
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Basic Wish for Children')
  })
})
