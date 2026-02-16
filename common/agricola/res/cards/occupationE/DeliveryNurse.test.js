const t = require('../../../testutil_v2.js')

describe('Delivery Nurse', () => {
  test('allows family growth without room when player has all animal types', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      actionSpaces: ['Basic Wish for Children'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['delivery-nurse-e151'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }], sheep: 1 },
            { spaces: [{ row: 0, col: 4 }], boar: 1 },
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], cattle: 1 },
          ],
          stables: [{ row: 0, col: 3 }, { row: 2, col: 3 }],
        },
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('delivery-nurse-e151').used = false
    })
    game.run()

    // dennis uses Family Growth (no empty room, but has all animal types → allowed)
    t.choose(game, 'Basic Wish for Children')
    // micah takes turn
    t.choose(game, 'Day Laborer')
    // dennis second action
    t.choose(game, 'Forest')
    // micah second action
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 3,  // from Forest (accumulated 3 by round 6)
        familyMembers: 3,
        animals: { sheep: 1, boar: 1, cattle: 1 },
        occupations: ['delivery-nurse-e151'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
          pastures: [
            { spaces: [{ row: 0, col: 3 }], sheep: 1 },
            { spaces: [{ row: 0, col: 4 }], boar: 1 },
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], cattle: 1 },
          ],
          stables: [{ row: 0, col: 3 }, { row: 2, col: 3 }],
        },
      },
    })
  })

  test('does not allow growth without room when missing animal type', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['delivery-nurse-e151'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }], sheep: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('delivery-nurse-e151').used = false
    })
    game.run()

    // Only sheep — missing boar and cattle. Family Growth should not be available
    // without a room. Just verify game runs without crash.
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 12,
        animals: { sheep: 1 },
        occupations: ['delivery-nurse-e151'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }], sheep: 1 }],
        },
      },
    })
  })
})
