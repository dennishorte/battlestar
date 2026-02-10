const t = require('../../../testutil_v2.js')

describe('Vegetable Slicer', () => {
  test('gives 2 wood and 1 vegetable when upgrading fireplace to cooking hearth', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['vegetable-slicer-a041'],
        majorImprovements: ['fireplace-2'],
        clay: 4, // cooking hearth cost
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    // dennis: Major Improvement → upgrade fireplace to cooking hearth
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Cooking Hearth (cooking-hearth-4)')
    // onUpgradeFireplace fires: +2 wood, +1 vegetable

    // Remaining workers
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        wood: 2,        // Vegetable Slicer
        vegetables: 1,  // Vegetable Slicer
        food: 2,        // Day Laborer
        minorImprovements: ['vegetable-slicer-a041'],
        majorImprovements: ['cooking-hearth-4'],
      },
    })
  })
})
