const t = require('../../../testutil_v2.js')

describe('Pen Builder', () => {
  test('place 1 wood when only 1 available', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['pen-builder-e086'],
        wood: 1,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('pen-builder-e086').wood = 0
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Pen Builder')
    expect(action).toBeDefined()

    // Only 1 wood → no amount prompt, places automatically
    t.anytimeAction(game, action)

    t.testBoard(game, {
      dennis: {
        wood: 0,   // 1 - 1
        occupations: ['pen-builder-e086'],
      },
    })

    // Verify card state
    expect(game.cardState('pen-builder-e086').wood).toBe(1)
  })

  test('choose amount when multiple wood available', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 2,
      dennis: {
        occupations: ['pen-builder-e086'],
        wood: 5,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('pen-builder-e086').wood = 0
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const action = game.getAnytimeActions(dennis).find(a => a.cardName === 'Pen Builder')

    t.anytimeAction(game, action)
    t.choose(game, 'Place 3 wood')

    t.testBoard(game, {
      dennis: {
        wood: 2,   // 5 - 3
        occupations: ['pen-builder-e086'],
      },
    })

    expect(game.cardState('pen-builder-e086').wood).toBe(3)
  })

  test('animal capacity is 2x wood placed', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['pen-builder-e086'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('pen-builder-e086').wood = 3
    })
    game.run()

    // 3 wood → capacity of 6
    const dennis = game.players.byName('dennis')
    const holdings = dennis.getAnimalHoldingCards()
    const penBuilder = holdings.find(h => h.cardId === 'pen-builder-e086')
    expect(penBuilder).toBeTruthy()
    expect(penBuilder.capacity).toBe(6)
  })

  test('not available without wood', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['pen-builder-e086'],
        wood: 0,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('pen-builder-e086').wood = 0
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Pen Builder')).toBe(false)
  })
})
