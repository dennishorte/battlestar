const t = require('../../../testutil_v2.js')

describe('Mason', () => {
  test('add free stone room with 4+ rooms', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['mason-c087'],
        roomType: 'stone',
        farmyard: {
          rooms: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('mason-c087').hasRoom = true
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Mason')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        roomType: 'stone',
        occupations: ['mason-c087'],
        farmyard: {
          rooms: [
            { row: 0, col: 0 }, { row: 1, col: 0 },
            { row: 0, col: 1 }, { row: 1, col: 1 },
            { row: 2, col: 0 },
          ],
        },
      },
    })
  })

  test('not available with fewer than 4 rooms', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['mason-c087'],
        roomType: 'stone',
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('mason-c087').hasRoom = true
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Mason')).toBe(false)
  })

  test('not available with non-stone house', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['mason-c087'],
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('mason-c087').hasRoom = true
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Mason')).toBe(false)
  })

  test('not available after room already used', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['mason-c087'],
        roomType: 'stone',
        farmyard: {
          rooms: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('mason-c087').hasRoom = false
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Mason')).toBe(false)
  })
})
