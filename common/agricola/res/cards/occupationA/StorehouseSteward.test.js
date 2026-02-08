const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Storehouse Steward (OccA 146)', () => {
  test('gives stone when taking exactly 2 food', () => {
    const card = res.getCardById('storehouse-steward-a146')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onAction(game, dennis, 'fishing', { food: 2 })

    expect(dennis.stone).toBe(1)
  })

  test('gives reed when taking exactly 3 food', () => {
    const card = res.getCardById('storehouse-steward-a146')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0

    card.onAction(game, dennis, 'fishing', { food: 3 })

    expect(dennis.reed).toBe(1)
  })

  test('gives clay when taking exactly 4 food', () => {
    const card = res.getCardById('storehouse-steward-a146')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'fishing', { food: 4 })

    expect(dennis.clay).toBe(1)
  })

  test('gives wood when taking exactly 5 food', () => {
    const card = res.getCardById('storehouse-steward-a146')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onAction(game, dennis, 'fishing', { food: 5 })

    expect(dennis.wood).toBe(1)
  })

  test('gives nothing when taking 1 food', () => {
    const card = res.getCardById('storehouse-steward-a146')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.reed = 0
    dennis.clay = 0
    dennis.wood = 0

    card.onAction(game, dennis, 'fishing', { food: 1 })

    expect(dennis.stone).toBe(0)
    expect(dennis.reed).toBe(0)
    expect(dennis.clay).toBe(0)
    expect(dennis.wood).toBe(0)
  })

  test('gives nothing when taking 6+ food', () => {
    const card = res.getCardById('storehouse-steward-a146')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.reed = 0
    dennis.clay = 0
    dennis.wood = 0

    card.onAction(game, dennis, 'fishing', { food: 6 })

    expect(dennis.stone).toBe(0)
    expect(dennis.reed).toBe(0)
    expect(dennis.clay).toBe(0)
    expect(dennis.wood).toBe(0)
  })
})
