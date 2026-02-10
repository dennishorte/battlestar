const t = require('../../../testutil_v2.js')

describe('Lifting Machine', () => {
  test('moves vegetable from field to supply at end of non-harvest round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lifting-machine-a070'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
          ],
        },
      },
    })
    game.run()

    // Round 1 (non-harvest): all 4 workers
    t.choose(game, 'Day Laborer')     // dennis
    t.choose(game, 'Grain Seeds')     // micah
    t.choose(game, 'Fishing')         // dennis
    t.choose(game, 'Clay Pit')        // micah

    // Round end → Lifting Machine fires → offer to move vegetable
    t.choose(game, 'Move 1 vegetable from field to supply')

    t.testBoard(game, {
      dennis: {
        food: 3, // 2 Day Laborer + 1 Fishing
        vegetables: 1, // moved from field
        minorImprovements: ['lifting-machine-a070'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 1 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
          ],
        },
      },
    })
  })

  test('can skip the lifting machine offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['lifting-machine-a070'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Fishing')
    t.choose(game, 'Clay Pit')

    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 3, // 2 Day Laborer + 1 Fishing
        minorImprovements: ['lifting-machine-a070'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'vegetables', cropCount: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
          ],
        },
      },
    })
  })
})
