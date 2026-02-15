const t = require('../../../testutil_v2.js')

describe('Wood Worker', () => {
  // Card is 4+ players. onAction: take wood → may exchange 1 wood for 1 sheep (place wood on space).

  test('onAction offers exchange 1 wood for 1 sheep when taking wood from Forest', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Forest', accumulated: 2 }],
      dennis: {
        occupations: ['wood-worker-a164'],
        wood: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Exchange 1 wood for 1 sheep')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-worker-a164'],
        wood: 1,
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
  })

  test('onAction allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [{ ref: 'Forest', accumulated: 1 }],
      dennis: {
        occupations: ['wood-worker-a164'],
        wood: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Forest')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['wood-worker-a164'],
        wood: 1,
        animals: { sheep: 0 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })
})
