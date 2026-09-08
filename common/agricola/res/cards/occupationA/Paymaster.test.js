const t = require('../../../testutil_v2.js')

describe('Paymaster', () => {
  test('onAnyAction offers to give 1 grain for 1 bonus point when another player uses food accumulation', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Fishing', accumulated: 2 }],
      dennis: {
        occupations: ['paymaster-a154'],
        grain: 3,
      },
    })
    game.run()

    t.choose(game, 'Fishing')   // micah uses food accumulation → Paymaster offers dennis
    t.choose(game, 'Give 1 grain to micah for 1 bonus point')

    t.testBoard(game, {
      dennis: {
        occupations: ['paymaster-a154'],
        grain: 2,
        bonusPoints: 1,
      },
      micah: { food: 2, grain: 1 },
    })
  })

  test('onAnyAction does not trigger for Meeting Place', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['paymaster-a154'],
        grain: 3,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')

    t.testBoard(game, {
      currentPlayer: 'scott',
      dennis: {
        occupations: ['paymaster-a154'],
        grain: 3,
        bonusPoints: 0,
      },
      micah: { food: 1, grain: 0 },
    })
  })

  test('allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: [{ ref: 'Fishing', accumulated: 1 }],
      dennis: {
        occupations: ['paymaster-a154'],
        grain: 2,
      },
    })
    game.run()

    t.choose(game, 'Fishing')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: { occupations: ['paymaster-a154'], grain: 2, bonusPoints: 0 },
      micah: { food: 1 },
    })
  })
})
