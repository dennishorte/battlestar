const t = require('../../../testutil_v2.js')

describe('Trowel', () => {
  test('renovate from wood to stone (2 stone, 2 reed, 2 food)', () => {
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['trowel-d013'],
        roomType: 'wood',
        stone: 3,
        reed: 3,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Trowel')
    expect(action).toBeDefined()
    expect(action.description).toContain('stone')

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        stone: 1,  // 3 - 2
        reed: 1,   // 3 - 2
        food: 3,   // 5 - 2
        roomType: 'stone',
        minorImprovements: ['trowel-d013'],
      },
    })
  })

  test('renovate from clay to stone (2 stone, no reed/food)', () => {
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['trowel-d013'],
        roomType: 'clay',
        stone: 3,
        reed: 2,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const action = game.getAnytimeActions(dennis).find(a => a.cardName === 'Trowel')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        stone: 1,  // 3 - 2
        reed: 2,   // unchanged
        food: 5,   // unchanged
        roomType: 'stone',
        minorImprovements: ['trowel-d013'],
      },
    })
  })

  test('not available when already stone', () => {
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['trowel-d013'],
        roomType: 'stone',
        stone: 5,
        reed: 5,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Trowel')).toBe(false)
  })

  test('not available without enough resources', () => {
    const game = t.fixture({ cardSets: ['minorD'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['trowel-d013'],
        roomType: 'wood',
        stone: 1,  // need 2
        reed: 2,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Trowel')).toBe(false)
  })
})
