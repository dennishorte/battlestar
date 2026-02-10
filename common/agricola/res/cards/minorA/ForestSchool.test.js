const t = require('../../../testutil_v2.js')

describe('Forest School', () => {
  test('allows using occupied Lessons action space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      micah: {
        hand: ['frame-builder-a123'], // an occupation to play
      },
      dennis: {
        minorImprovements: ['forest-school-a028'],
        hand: ['wall-builder-a111'], // an occupation to play
      },
      actionSpaces: ['Lessons A', 'Day Laborer', 'Forest'],
    })
    game.run()

    // micah takes Lessons A (occupies it), plays occupation (free)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Frame Builder')

    // dennis can still take Lessons A despite occupied (via Forest School)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Wall Builder')

    t.testBoard(game, {
      dennis: {
        hand: [],
        minorImprovements: ['forest-school-a028'],
        occupations: ['wall-builder-a111'],
      },
    })
  })

  test('allows paying wood instead of food for occupation', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['forest-school-a028'],
        occupations: ['frame-builder-a123'], // 1 already played, next costs food
        hand: ['wall-builder-a111'], // another occupation to play
        wood: 1,
      },
      actionSpaces: ['Lessons A', 'Day Laborer', 'Forest'],
    })
    game.run()

    // dennis takes Lessons A. 2nd occupation costs 1 food.
    // Forest School converts food cost to woodOrFood — dennis has 1 wood, 0 food
    t.choose(game, 'Lessons A')
    t.choose(game, 'Wall Builder')

    t.testBoard(game, {
      dennis: {
        wood: 0, // paid 1 wood instead of food
        hand: [],
        minorImprovements: ['forest-school-a028'],
        occupations: ['frame-builder-a123', 'wall-builder-a111'],
      },
    })
  })
})
