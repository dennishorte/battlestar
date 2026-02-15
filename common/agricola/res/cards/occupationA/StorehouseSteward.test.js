const t = require('../../../testutil_v2.js')

describe('Storehouse Steward', () => {
  // Card is 3+ players only. 2 food → +1 stone, 3 → +1 reed, 4 → +1 clay, 5 → +1 wood. 6+ no bonus.
  test('onAction gives 1 stone when taking 2 food from accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Fishing', accumulated: 2 }],
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 0,
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 2,
        stone: 1,
      },
    })
  })

  test('onAction gives 1 reed when taking 3 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Fishing', accumulated: 3 }],
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 0,
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 3,
        reed: 1,
      },
    })
  })

  test('onAction gives 1 clay when taking 4 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Fishing', accumulated: 4 }],
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 0,
        clay: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 4,
        clay: 1,
      },
    })
  })

  test('onAction gives 1 wood when taking 5 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Fishing', accumulated: 5 }],
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 0,
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 5,
        wood: 1,
      },
    })
  })

  test('onAction gives no bonus when taking 6+ food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Fishing', accumulated: 6 }],
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 0,
        wood: 0,
        clay: 0,
        reed: 0,
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['storehouse-steward-a146'],
        food: 6,
        wood: 0,
        clay: 0,
        reed: 0,
        stone: 0,
      },
    })
  })
})
