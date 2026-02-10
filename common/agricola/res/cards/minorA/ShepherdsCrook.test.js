const t = require('../../../testutil_v2.js')

describe("Shepherd's Crook", () => {
  test('gives 2 sheep when building 4+ space pasture via Fencing', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['shepherds-crook-a083'],
        wood: 10, // 10 fences for a 4-space pasture in a row
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }] })
    t.action(game, 'done-building-pastures')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['shepherds-crook-a083'],
        animals: { sheep: 2 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 2 }],
        },
      },
    })
  })

  test('does not give sheep for pastures smaller than 4 spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['shepherds-crook-a083'],
        wood: 6, // 6 fences for a 2-space pasture in a row
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }] })
    t.action(game, 'done-building-pastures')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['shepherds-crook-a083'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }] }],
        },
      },
    })
  })
})
