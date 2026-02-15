const t = require('../../../testutil_v2.js')

describe('Sower', () => {
  test('building major improvement accumulates reed on card', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        occupations: ['sower-c115'],
        clay: 2, // for Fireplace (2 clay)
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('sower-c115').reed = 0
    })
    game.run()

    // Dennis buys Fireplace → Sower gets 1 reed
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    expect(game.cardState('sower-c115').reed).toBe(1)
  })

  test('anytime action: take reed moves reed to player supply', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['sower-c115'],
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('sower-c115').reed = 3
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const takeReed = actions.find(a => a.actionKey === 'takeReed')
    expect(takeReed).toBeDefined()

    t.anytimeAction(game, takeReed)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        reed: 3,
        food: 2, // from Day Laborer
        grain: 1, // from Grain Seeds
        occupations: ['sower-c115'],
      },
    })
    expect(game.cardState('sower-c115').reed).toBe(0)
  })

  test('anytime action: exchange reed for sow action', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['sower-c115'],
        grain: 2,
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('sower-c115').reed = 2
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const sowAction = actions.find(a => a.actionKey === 'exchangeForSow')
    expect(sowAction).toBeDefined()

    t.anytimeAction(game, sowAction)
    // Sow grain in a field
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.choose(game, 'Done Sowing')

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    // Re-get player reference after replays
    const dennisAfter = game.players.byName('dennis')
    expect(game.cardState('sower-c115').reed).toBe(0)
    const field = dennisAfter.getSpace(0, 2)
    expect(field.crop).toBe('grain')
  })

  test('no anytime action when 0 reed on card', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['sower-c115'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('sower-c115').reed = 0
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardId === 'sower-c115')).toBe(false)
  })
})
