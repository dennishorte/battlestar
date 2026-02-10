const t = require('../../../testutil_v2.js')

describe('Sleeping Corner', () => {
  test('allows using occupied Wish for Children action space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      micah: {
        hand: [], // Clear hand so minor improvement is auto-skipped
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms for family growth
        },
      },
      dennis: {
        hand: [], // Clear hand so minor improvement is auto-skipped
        minorImprovements: ['sleeping-corner-a026'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }], // 3 rooms for family growth
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
          ],
        },
      },
      actionSpaces: ['Basic Wish for Children', 'Day Laborer', 'Forest'],
    })
    game.run()

    // micah takes Basic Wish for Children first (occupies it)
    // Minor improvement auto-skipped (empty hand)
    t.choose(game, 'Basic Wish for Children')

    // dennis can still take it despite being occupied (via Sleeping Corner)
    // Minor improvement auto-skipped (empty hand)
    t.choose(game, 'Basic Wish for Children')

    t.testBoard(game, {
      dennis: {
        familyMembers: 3,
        hand: [],
        minorImprovements: ['sleeping-corner-a026'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 1 },
            { row: 0, col: 3, crop: 'grain', cropCount: 1 },
          ],
        },
      },
    })
  })
})
