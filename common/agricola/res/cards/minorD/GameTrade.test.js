const t = require('../../../testutil_v2.js')

describe('Game Trade', () => {
  test('exchanges 2 sheep for 1 boar and 1 cattle', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['game-trade-d009'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 2 },
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Game Trade')

    // 2 sheep paid as cost, get 1 boar + 1 cattle placed in pastures
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place gives 1 food
        animals: { boar: 1, cattle: 1 },
        minorImprovements: ['game-trade-d009'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], boar: 1 },
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], cattle: 1 },
          ],
        },
      },
    })
  })
})
