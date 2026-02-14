const t = require('../../../testutil_v2.js')


describe('Muddy Puddles', () => {
  test('pay 1 clay → take top good (sheep first)', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['muddy-puddles-b083'],
        clay: 3,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('muddy-puddles-b083').stack = ['boar', 'food', 'cattle', 'food', 'sheep']
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Muddy Puddles')
    expect(action).toBeDefined()
    expect(action.description).toContain('sheep')

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        clay: 2, // 3 - 1
        pet: 'sheep',
        animals: { sheep: 1 },
        minorImprovements: ['muddy-puddles-b083'],
      },
    })

    expect(game.cardState('muddy-puddles-b083').stack).toEqual(['boar', 'food', 'cattle', 'food'])
  })

  test('take food from stack', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        minorImprovements: ['muddy-puddles-b083'],
        clay: 3,
        food: 2,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      // Stack with food on top
      game.cardState('muddy-puddles-b083').stack = ['boar', 'food']
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const action = game.getAnytimeActions(dennis).find(a => a.cardName === 'Muddy Puddles')
    expect(action.description).toContain('food')

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        clay: 2,
        food: 3, // 2 + 1
        minorImprovements: ['muddy-puddles-b083'],
      },
    })

    expect(game.cardState('muddy-puddles-b083').stack).toEqual(['boar'])
  })

  test('not available when stack empty', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['muddy-puddles-b083'],
        clay: 5,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('muddy-puddles-b083').stack = []
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Muddy Puddles')).toBe(false)
  })

  test('not available without clay', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['muddy-puddles-b083'],
        clay: 0,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('muddy-puddles-b083').stack = ['boar', 'food']
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Muddy Puddles')).toBe(false)
  })
})
