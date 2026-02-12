const t = require('../../../testutil_v2.js')

describe('Fern Seeds', () => {
  test('get 2 food and force sow grain', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['fern-seeds-d008'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 2 },
            { row: 2, col: 2 },  // empty field
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Fern Seeds')
    // Single empty field → auto-selected, grain auto-sown

    t.testBoard(game, {
      dennis: {
        food: 3,  // 1 (Meeting Place) + 2 (Fern Seeds)
        minorImprovements: ['fern-seeds-d008'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 2 },
            { row: 2, col: 2, crop: 'grain', cropCount: 3 },  // sown: 1 grain → 3 total
          ],
        },
      },
    })
  })

  test('choose which empty field when multiple available', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['fern-seeds-d008'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 2 },
            { row: 2, col: 2 },  // empty field
            { row: 2, col: 3 },  // empty field
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Fern Seeds')
    t.choose(game, '2,3')  // choose second empty field

    t.testBoard(game, {
      dennis: {
        food: 3,  // 1 (Meeting Place) + 2 (Fern Seeds)
        minorImprovements: ['fern-seeds-d008'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 2 },
            { row: 2, col: 2 },  // still empty
            { row: 2, col: 3, crop: 'grain', cropCount: 3 },  // sown here
          ],
        },
      },
    })
  })
})
