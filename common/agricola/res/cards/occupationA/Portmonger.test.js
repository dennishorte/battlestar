const t = require('../../../testutil_v2.js')

describe('Portmonger', () => {
  test('onAction grants 1 vegetable when taking 1 food from accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 1 }],
      dennis: {
        occupations: ['portmonger-a103'],
        food: 0,
        vegetables: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['portmonger-a103'],
        food: 1,
        vegetables: 1,
      },
    })
  })

  test('onAction grants 1 grain when taking 2 food from accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 2 }],
      dennis: {
        occupations: ['portmonger-a103'],
        food: 0,
        grain: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['portmonger-a103'],
        food: 2,
        grain: 1,
      },
    })
  })

  test('onAction grants 1 reed when taking 3+ food from accumulation space', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Fishing', accumulated: 4 }],
      dennis: {
        occupations: ['portmonger-a103'],
        food: 0,
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        occupations: ['portmonger-a103'],
        food: 4,
        reed: 1,
      },
    })
  })

  test('onAction does not trigger for non-food accumulation actions', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: [{ ref: 'Clay Pit', accumulated: 2 }],
      dennis: {
        occupations: ['portmonger-a103'],
        clay: 0,
        vegetables: 0,
        grain: 0,
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        occupations: ['portmonger-a103'],
        clay: 2,
        vegetables: 0,
        grain: 0,
        reed: 0,
      },
    })
  })
})
