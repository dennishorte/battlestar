const t = require('../../../testutil_v2.js')

describe('Milking Parlor', () => {
  test('gives 3 food for 3 sheep on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['milking-parlor-a057'],
        wood: 2, // cost of Milking Parlor
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 3 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Milking Parlor')

    t.testBoard(game, {
      dennis: {
        food: 4, // +1 Meeting Place + 3 from Milking Parlor (3 sheep)
        hand: [],
        minorImprovements: ['milking-parlor-a057'],
        animals: { sheep: 3 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 3 }],
        },
      },
    })
  })

  test('gives 4 food for 4+ sheep on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['milking-parlor-a057'],
        wood: 2, // cost
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 4 },
            { spaces: [{ row: 1, col: 1 }], sheep: 1 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Milking Parlor')

    t.testBoard(game, {
      dennis: {
        food: 5, // +1 Meeting Place + 4 from Milking Parlor (5 sheep → 4 food)
        hand: [],
        minorImprovements: ['milking-parlor-a057'],
        animals: { sheep: 5 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 4 },
            { spaces: [{ row: 1, col: 1 }], sheep: 1 },
          ],
        },
      },
    })
  })

  test('gives food for cattle on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['milking-parlor-a057'],
        wood: 2, // cost
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], cattle: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Milking Parlor')

    t.testBoard(game, {
      dennis: {
        food: 4, // +1 Meeting Place + 3 from Milking Parlor (2 cattle → 3 food)
        hand: [],
        minorImprovements: ['milking-parlor-a057'],
        animals: { cattle: 2 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], cattle: 2 }],
        },
      },
    })
  })

  test('gives no food when no animals', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['milking-parlor-a057'],
        wood: 2, // cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Milking Parlor')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 Meeting Place only
        hand: [],
        minorImprovements: ['milking-parlor-a057'],
      },
    })
  })
})
