const t = require('../../../testutil_v2.js')

function respondAnytimeAction(game, anytimeAction) {
  const request = game.waiting
  const selector = request.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: 'anytime-action', anytimeAction },
  })
}

describe('Master Builder', () => {
  test('add free room with 5+ rooms', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['master-builder-d087'],
        farmyard: {
          rooms: [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('master-builder-d087').used = false
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Master Builder')
    expect(action).toBeDefined()

    respondAnytimeAction(game, action)
    t.choose(game, '2,1')

    t.testBoard(game, {
      dennis: {
        occupations: ['master-builder-d087'],
        farmyard: {
          rooms: [
            { row: 0, col: 0 }, { row: 1, col: 0 },
            { row: 0, col: 1 }, { row: 1, col: 1 },
            { row: 2, col: 0 }, { row: 2, col: 1 },
          ],
        },
      },
    })
  })

  test('only usable once per game', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['master-builder-d087'],
        farmyard: {
          rooms: [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('master-builder-d087').used = true
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Master Builder')).toBe(false)
  })

  test('not available with fewer than 5 rooms', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['master-builder-d087'],
        farmyard: {
          rooms: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('master-builder-d087').used = false
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Master Builder')).toBe(false)
  })
})
