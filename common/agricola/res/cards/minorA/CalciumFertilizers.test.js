const t = require('../../../testutil_v2.js')

describe('Calcium Fertilizers', () => {
  test('adds crop to planted fields on quarry action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['calcium-fertilizers-a072'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
            { row: 2, col: 1, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
      actionSpaces: ['Western Quarry'],
    })
    game.run()

    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        stone: 1, // 1 from Western Quarry
        minorImprovements: ['calcium-fertilizers-a072'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 3 },     // +1 from Calcium Fertilizers
            { row: 2, col: 1, crop: 'vegetables', cropCount: 2 }, // +1 from Calcium Fertilizers
          ],
        },
      },
    })
  })

  test('does not add crop to empty fields', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['calcium-fertilizers-a072'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 0 },
          ],
        },
      },
      actionSpaces: ['Western Quarry'],
    })
    game.run()

    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        stone: 1,
        minorImprovements: ['calcium-fertilizers-a072'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 0 }, // unchanged
          ],
        },
      },
    })
  })

  test('does not trigger on non-quarry actions', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['calcium-fertilizers-a072'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        minorImprovements: ['calcium-fertilizers-a072'],
        farmyard: {
          fields: [
            { row: 2, col: 0, crop: 'grain', cropCount: 2 }, // unchanged
          ],
        },
      },
    })
  })
})
