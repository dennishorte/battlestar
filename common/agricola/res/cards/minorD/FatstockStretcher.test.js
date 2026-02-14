const t = require('../../../testutil_v2.js')

describe('Fatstock Stretcher', () => {
  test('+1 food when cooking sheep', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['fatstock-stretcher-d056'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const cookAction = actions.find(a => a.type === 'cook' && a.resource === 'sheep')
    t.anytimeAction(game, cookAction)
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 3,   // 2 (fireplace) + 1 (fatstock stretcher)
        grain: 1,  // from Grain Seeds
        minorImprovements: ['fatstock-stretcher-d056'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('+1 food when cooking boar', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['fatstock-stretcher-d056'],
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
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 3,   // 2 (fireplace) + 1 (fatstock stretcher)
        grain: 1,
        minorImprovements: ['fatstock-stretcher-d056'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('no bonus when cooking cattle', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['fatstock-stretcher-d056'],
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
    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        food: 3,   // 3 (fireplace cattle rate), no fatstock stretcher bonus
        grain: 1,
        minorImprovements: ['fatstock-stretcher-d056'],
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })
})
