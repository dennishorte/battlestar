const t = require('../../../testutil_v2.js')

describe('Joiner of the Sea', () => {
  test('onAnyAction offers to give 1 wood for 2 food when another player uses Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Fishing', accumulated: 1 }],
      dennis: {
        occupations: ['joiner-of-the-sea-a159'],
        wood: 3,
      },
    })
    game.run()

    t.choose(game, 'Fishing')   // micah uses Fishing → Joiner offers dennis (2 food)
    t.choose(game, 'Give 1 wood to micah to get 2 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['joiner-of-the-sea-a159'],
        wood: 2,
        food: 2,
      },
      micah: { food: 1, wood: 1 },
    })
  })

  test('onAnyAction offers 3 food when another player uses Reed Bank', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Reed Bank', accumulated: 1 }],
      dennis: {
        occupations: ['joiner-of-the-sea-a159'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')
    t.choose(game, 'Give 1 wood to micah to get 3 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['joiner-of-the-sea-a159'],
        wood: 1,
        food: 3,
      },
      micah: { reed: 1, wood: 1 },
    })
  })

  test('allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Fishing', accumulated: 1 }],
      dennis: {
        occupations: ['joiner-of-the-sea-a159'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Fishing')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: { occupations: ['joiner-of-the-sea-a159'], wood: 2, food: 0 },
      micah: { food: 1 },
    })
  })
})
