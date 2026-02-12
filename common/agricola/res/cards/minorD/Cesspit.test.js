const t = require('../../../testutil_v2.js')

describe('Cesspit', () => {
  test('alternates clay and boar on remaining rounds', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['cesspit-d040'],
        occupations: ['test-occupation-1'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Cesspit')

    // Rounds 11-14: clay, boar, clay, boar
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        occupations: ['test-occupation-1'],
        minorImprovements: ['cesspit-d040'],
        farmyard: {
          fields: [
            { row: 2, col: 0 },
            { row: 2, col: 1 },
          ],
        },
        scheduled: {
          clay: { 11: 1, 13: 1 },
          boar: { 12: 1, 14: 1 },
        },
      },
    })
  })
})
