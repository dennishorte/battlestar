const t = require('../../../testutil_v2.js')

describe('Diligent Farmer', () => {
  test('builds free room when 3+ scoring categories at max', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['diligent-farmer-e127'],
        food: 5,
        grain: 8,        // 4 pts (grain)
        vegetables: 4,   // 4 pts (vegetables)
        farmyard: {
          fields: [
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 },
            { row: 1, col: 4 }, { row: 2, col: 4 },
          ], // 5 fields = 4 pts
        },
      },
    })
    game.run()

    // Play Diligent Farmer via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Diligent Farmer')
    // 3 categories at max score → free room offered
    // Choose where to build room
    t.choose(game, '2,0')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 5, // first occ is free
        grain: 8,
        vegetables: 4,
        occupations: ['diligent-farmer-e127'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
          fields: [
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 },
            { row: 1, col: 4 }, { row: 2, col: 4 },
          ],
        },
      },
    })
  })

  test('no free room when fewer than 3 categories at max', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['diligent-farmer-e127'],
        food: 5,
        grain: 1,  // 1 pt (not max)
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Diligent Farmer')
    // Not enough max categories → no free room offer

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 5,  // first occ is free
        grain: 1,
        occupations: ['diligent-farmer-e127'],
      },
    })
  })
})
