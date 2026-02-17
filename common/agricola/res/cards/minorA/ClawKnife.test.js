const t = require('../../../testutil_v2.js')

describe('Claw Knife', () => {
  test('schedules food on next 2 rounds when using Sheep Market', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['claw-knife-a046'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['claw-knife-a046'],
        animals: { sheep: 1 },
        scheduled: { food: { 2: 1, 3: 1 } },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 }],
        },
      },
    })
  })
})
