const t = require('../../../testutil_v2.js')

describe("Gardener's Knife", () => {
  test('gives food for grain fields and grain for vegetable fields', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['gardeners-knife-a007'],
        wood: 1, // cost
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
            { row: 0, col: 4, crop: 'vegetables', cropCount: 3 },
            { row: 1, col: 4, crop: 'vegetables', cropCount: 1 },
            { row: 2, col: 4, crop: 'vegetables', cropCount: 2 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, "Minor Improvement.Gardener's Knife")

    t.testBoard(game, {
      dennis: {
        food: 3, // +1 Meeting Place + 2 for 2 grain fields
        grain: 3, // +3 for 3 vegetable fields
        hand: [],
        minorImprovements: ['gardeners-knife-a007'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
            { row: 0, col: 4, crop: 'vegetables', cropCount: 3 },
            { row: 1, col: 4, crop: 'vegetables', cropCount: 1 },
            { row: 2, col: 4, crop: 'vegetables', cropCount: 2 },
          ],
        },
      },
    })
  })

  test('gives nothing when no fields', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['gardeners-knife-a007'],
        wood: 1, // cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, "Minor Improvement.Gardener's Knife")

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 Meeting Place only
        hand: [],
        minorImprovements: ['gardeners-knife-a007'],
      },
    })
  })
})
