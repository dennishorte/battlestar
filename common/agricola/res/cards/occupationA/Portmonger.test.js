const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Portmonger (OccA 103)', () => {
  test('gives vegetable when taking 1 food', () => {
    const card = res.getCardById('portmonger-a103')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0

    card.onAction(game, dennis, 'fishing', { food: 1 })

    expect(dennis.vegetables).toBe(1)
  })

  test('gives grain when taking 2 food', () => {
    const card = res.getCardById('portmonger-a103')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onAction(game, dennis, 'fishing', { food: 2 })

    expect(dennis.grain).toBe(1)
  })

  test('gives reed when taking 3+ food', () => {
    const card = res.getCardById('portmonger-a103')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0

    card.onAction(game, dennis, 'fishing', { food: 3 })

    expect(dennis.reed).toBe(1)
  })

  test('gives reed when taking 5 food', () => {
    const card = res.getCardById('portmonger-a103')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0

    card.onAction(game, dennis, 'fishing', { food: 5 })

    expect(dennis.reed).toBe(1)
  })

  test('does not give anything without food resource', () => {
    const card = res.getCardById('portmonger-a103')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.grain = 0
    dennis.reed = 0

    card.onAction(game, dennis, 'take-wood', { wood: 3 })

    expect(dennis.vegetables).toBe(0)
    expect(dennis.grain).toBe(0)
    expect(dennis.reed).toBe(0)
  })

  test('does not give anything when taking 0 food', () => {
    const card = res.getCardById('portmonger-a103')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0

    card.onAction(game, dennis, 'fishing', { food: 0 })

    expect(dennis.vegetables).toBe(0)
  })
})
