const t = require('../../../testutil_v2.js')

describe('Cordmaker', () => {
  test('onAnyAction offers choice when another player takes 2+ reed from Reed Bank', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Reed Bank', accumulated: 2 }],
      dennis: {
        occupations: ['cordmaker-a142'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')   // micah takes 2 reed → Cordmaker offers dennis
    t.choose(game, 'Take 1 grain')

    t.testBoard(game, {
      dennis: {
        occupations: ['cordmaker-a142'],
        grain: 1,
      },
      micah: { reed: 2 },
    })
  })

  test('owner can choose buy 1 vegetable for 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Reed Bank', accumulated: 2 }],
      dennis: {
        occupations: ['cordmaker-a142'],
        food: 5,
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')
    t.choose(game, 'Buy 1 vegetable for 2 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['cordmaker-a142'],
        food: 3,
        vegetables: 1,
      },
      micah: { reed: 2 },
    })
  })

  test('owner can skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Reed Bank', accumulated: 2 }],
      dennis: {
        occupations: ['cordmaker-a142'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['cordmaker-a142'],
        grain: 0,
        vegetables: 0,
      },
      micah: { reed: 2 },
    })
  })

  test('does not trigger when only 1 reed taken', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Reed Bank', accumulated: 1 }],
      dennis: {
        occupations: ['cordmaker-a142'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')   // micah takes 1 reed → no Cordmaker offer

    t.testBoard(game, {
      dennis: {
        occupations: ['cordmaker-a142'],
        grain: 0,
      },
      micah: { reed: 1 },
    })
  })

  test('triggers when owner takes 2+ reed (including you)', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Reed Bank', accumulated: 2 }],
      dennis: {
        occupations: ['cordmaker-a142'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')   // dennis takes 2 reed → Cordmaker offers dennis
    t.choose(game, 'Take 1 grain')

    t.testBoard(game, {
      dennis: {
        occupations: ['cordmaker-a142'],
        reed: 2,
        grain: 1,
      },
    })
  })
})
