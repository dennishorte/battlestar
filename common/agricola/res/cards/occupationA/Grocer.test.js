const t = require('../../../testutil_v2.js')

describe('Grocer', () => {
  test('onPlay initializes goods stack', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['grocer-a102'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Grocer')

    const state = game.cardState('grocer-a102')
    expect(state.goods).toEqual([
      'wood', 'grain', 'reed', 'stone', 'vegetables', 'clay', 'reed', 'vegetables',
    ])
  })

  test('buy top good (vegetables) for 1 food', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['grocer-a102'],
        food: 5,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('grocer-a102').goods = ['wood', 'grain', 'reed', 'stone', 'vegetables', 'clay', 'reed', 'vegetables']
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Grocer')
    expect(action).toBeDefined()
    expect(action.description).toContain('vegetables')

    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        food: 4, // 5 - 1
        vegetables: 1,
        occupations: ['grocer-a102'],
      },
    })

    expect(game.cardState('grocer-a102').goods).toEqual([
      'wood', 'grain', 'reed', 'stone', 'vegetables', 'clay', 'reed',
    ])
  })

  test('not available when stack empty', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['grocer-a102'],
        food: 5,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('grocer-a102').goods = []
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Grocer')).toBe(false)
  })

  test('not available without food', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['grocer-a102'],
        food: 0,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('grocer-a102').goods = ['wood']
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Grocer')).toBe(false)
  })
})
