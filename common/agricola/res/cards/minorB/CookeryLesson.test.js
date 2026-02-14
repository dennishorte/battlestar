const t = require('../../../testutil_v2.js')

describe('Cookery Lesson', () => {
  test('awards bonus point for cooking + Lessons on same turn', () => {
    const game = t.fixture({ cardSets: ['minorB', 'test'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['cookery-lesson-b029'],
        majorImprovements: ['fireplace-2'],
        hand: ['test-occupation-1'],
        vegetables: 2,
      },
    })
    game.run()

    // Cook a vegetable using Fireplace (anytime action)
    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const cookAction = actions.find(a => a.type === 'cook-vegetable')
    expect(cookAction).toBeDefined()

    t.anytimeAction(game, cookAction)

    // Take Lessons A to play an occupation
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        bonusPoints: 1,
        vegetables: 1,   // 2 - 1
        food: 2,          // 0 + 2 (from cooking)
        minorImprovements: ['cookery-lesson-b029'],
        majorImprovements: ['fireplace-2'],
        occupations: ['test-occupation-1'],
      },
    })
  })

  test('no bonus when using Lessons without cooking', () => {
    const game = t.fixture({ cardSets: ['minorB', 'test'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['cookery-lesson-b029'],
        majorImprovements: ['fireplace-2'],
        hand: ['test-occupation-1'],
        vegetables: 2,
      },
    })
    game.run()

    // Take Lessons without cooking first
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        bonusPoints: 0,   // no cooking → no bonus
        vegetables: 2,
        minorImprovements: ['cookery-lesson-b029'],
        majorImprovements: ['fireplace-2'],
        occupations: ['test-occupation-1'],
      },
    })
  })

  test('no bonus when cooking without Lessons', () => {
    const game = t.fixture({ cardSets: ['minorB', 'test'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['cookery-lesson-b029'],
        majorImprovements: ['fireplace-2'],
        vegetables: 2,
      },
    })
    game.run()

    // Cook a vegetable but take Day Laborer instead of Lessons
    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const cookAction = actions.find(a => a.type === 'cook-vegetable')

    t.anytimeAction(game, cookAction)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        bonusPoints: 0,   // no Lessons → no bonus
        vegetables: 1,    // 2 - 1
        food: 4,          // 0 + 2 (cooking) + 2 (day laborer)
        minorImprovements: ['cookery-lesson-b029'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
