const t = require('../../../testutil_v2.js')

describe('Game Catcher', () => {
  // Card text: "When you play this card, pay 1 food for each remaining harvest
  // to immediately get 1 cattle and 1 wild boar."

  test('pays food per remaining harvest and gets cattle + boar', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['game-catcher-c165'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }] },
            { spaces: [{ row: 0, col: 4 }] },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 2: harvests at 4,7,9,11,13,14 — remaining = 6
    t.choose(game, 'Lessons A')
    t.choose(game, 'Game Catcher')

    t.testBoard(game, {
      dennis: {
        food: 4,  // 10 - 6 harvests remaining
        occupations: ['game-catcher-c165'],
        animals: { cattle: 1, boar: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }], cattle: 1 },
            { spaces: [{ row: 0, col: 4 }], boar: 1 },
          ],
        },
      },
    })
  })

  test('does nothing if not enough food', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['game-catcher-c165'],
        food: 2,  // not enough for 6 harvests
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }] },
            { spaces: [{ row: 0, col: 4 }] },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Game Catcher')

    t.testBoard(game, {
      dennis: {
        food: 2,  // unchanged
        occupations: ['game-catcher-c165'],
        animals: {},
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }] },
            { spaces: [{ row: 0, col: 4 }] },
          ],
        },
      },
    })
  })
})
