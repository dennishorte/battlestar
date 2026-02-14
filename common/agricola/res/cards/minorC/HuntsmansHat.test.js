const t = require('../../../testutil_v2.js')

describe("Huntsman's Hat", () => {
  test('gives food when gaining boar from Pig Market', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['huntsmans-hat-c052'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }] },
          ],
        },
      },
      actionSpaces: ['Pig Market'],
    })
    game.run()

    t.choose(game, 'Pig Market')

    t.testBoard(game, {
      dennis: {
        food: 1, // 1 food from Huntsman's Hat (1 boar accumulated on Pig Market)
        animals: { boar: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], boar: 1 },
          ],
        },
        minorImprovements: ['huntsmans-hat-c052'],
      },
    })
  })

  test('no food when gaining sheep from action space', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['huntsmans-hat-c052'],
      },
      actionSpaces: ['Sheep Market'],
    })
    game.run()

    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        // food: 0 — no food from Huntsman's Hat for sheep
        pet: 'sheep',
        animals: { sheep: 1 },
        minorImprovements: ['huntsmans-hat-c052'],
      },
    })
  })
})
