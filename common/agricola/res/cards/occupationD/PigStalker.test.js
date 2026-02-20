const t = require('../../../testutil_v2.js')

describe('Pig Stalker', () => {
  // Card text: "Each time you use an animal accumulation space, if you occupy
  // either the action space immediately above or below that accumulation space,
  // you also get 1 wild boar."
  //
  // In a 2p game with actionSpaces: ['Sheep Market'], Sheep Market is at deck
  // index 0 → accumulating column (col 1), rows 0-4. Forest (take-wood) is at
  // col 1, rows 4-6 — immediately below (shared boundary at row 4).

  test('gets 1 boar when using Sheep Market with own person on space below', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pig-stalker-d165'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Forest')      // dennis occupies take-wood (col 1, rows 4-6)
    t.choose(game, 'Grain Seeds') // micah
    t.choose(game, 'Sheep Market') // dennis → PigStalker triggers (Forest is below)

    t.testBoard(game, {
      dennis: {
        wood: 3,
        occupations: ['pig-stalker-d165'],
        animals: { sheep: 1, boar: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 1 },
            { spaces: [{ row: 2, col: 1 }], boar: 1 },
          ],
        },
      },
    })
  })

  test('does not trigger when no own person occupies space above or below', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pig-stalker-d165'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')  // dennis takes Grain Seeds (col 0) — not adjacent column-wise to Sheep Market
    t.choose(game, 'Forest')       // micah takes Forest
    t.choose(game, 'Sheep Market') // dennis → no own person above/below in same column

    t.testBoard(game, {
      dennis: {
        grain: 1,
        occupations: ['pig-stalker-d165'],
        animals: { sheep: 1, boar: 0 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
  })

  test('does not trigger on non-animal accumulation spaces like Forest', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pig-stalker-d165'],
      },
    })
    game.run()

    t.choose(game, 'Forest')  // dennis takes Forest — not an animal accumulation space

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,
        occupations: ['pig-stalker-d165'],
        animals: { boar: 0 },
      },
    })
  })

  test('does not trigger when opponent occupies the adjacent space', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Sheep Market'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['pig-stalker-d165'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Forest')       // micah occupies Forest (col 1, rows 4-6)
    t.choose(game, 'Sheep Market') // dennis → Forest occupied by micah, not dennis

    t.testBoard(game, {
      dennis: {
        occupations: ['pig-stalker-d165'],
        animals: { sheep: 1, boar: 0 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
  })
})
