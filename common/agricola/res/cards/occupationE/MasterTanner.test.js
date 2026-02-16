const t = require('../../../testutil_v2.js')

describe('Master Tanner', () => {
  test('places food on card when cooking boar via anytime action', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-tanner-e085'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], boar: 1 }],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const cookAction = actions.find(a => a.type === 'cook' && a.resource === 'boar')
    t.anytimeAction(game, cookAction)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 4, // 2 (fireplace boar rate) + 2 (Day Laborer)
        occupations: ['master-tanner-e085'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })

    // Verify card state has food on it
    const cardState = game.cardState('master-tanner-e085')
    expect(cardState.food).toBe(1)
  })

  test('places food on card when cooking cattle', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-tanner-e085'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], cattle: 1 }],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const cookAction = actions.find(a => a.type === 'cook' && a.resource === 'cattle')
    t.anytimeAction(game, cookAction)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 5, // 3 (fireplace cattle rate) + 2 (Day Laborer)
        occupations: ['master-tanner-e085'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })

    const cardState = game.cardState('master-tanner-e085')
    expect(cardState.food).toBe(1)
  })
})
