const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Seed Trader (OccD 114)', () => {
  test('initializes with 2 grain and 2 vegetables on play', () => {
    const card = res.getCardById('seed-trader-d114')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.grain).toBe(2)
    expect(card.vegetables).toBe(2)
  })

  test('canBuyGrain returns true when grain available', () => {
    const card = res.getCardById('seed-trader-d114')
    card.grain = 1

    expect(card.canBuyGrain()).toBe(true)
  })

  test('canBuyGrain returns false when grain depleted', () => {
    const card = res.getCardById('seed-trader-d114')
    card.grain = 0

    expect(card.canBuyGrain()).toBe(false)
  })

  test('canBuyVegetable returns true when vegetables available', () => {
    const card = res.getCardById('seed-trader-d114')
    card.vegetables = 1

    expect(card.canBuyVegetable()).toBe(true)
  })

  test('canBuyVegetable returns false when vegetables depleted', () => {
    const card = res.getCardById('seed-trader-d114')
    card.vegetables = 0

    expect(card.canBuyVegetable()).toBe(false)
  })

  test('buyGrain exchanges 2 food for 1 grain', () => {
    const card = res.getCardById('seed-trader-d114')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    dennis.grain = 0
    card.grain = 2

    card.buyGrain(game, dennis)

    expect(dennis.food).toBe(3)
    expect(dennis.grain).toBe(1)
    expect(card.grain).toBe(1)
  })

  test('buyGrain does nothing when not enough food', () => {
    const card = res.getCardById('seed-trader-d114')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    dennis.grain = 0
    card.grain = 2

    card.buyGrain(game, dennis)

    expect(dennis.food).toBe(1)
    expect(dennis.grain).toBe(0)
  })

  test('buyVegetable exchanges 3 food for 1 vegetable', () => {
    const card = res.getCardById('seed-trader-d114')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    dennis.vegetables = 0
    card.vegetables = 2

    card.buyVegetable(game, dennis)

    expect(dennis.food).toBe(2)
    expect(dennis.vegetables).toBe(1)
    expect(card.vegetables).toBe(1)
  })

  test('buyVegetable does nothing when not enough food', () => {
    const card = res.getCardById('seed-trader-d114')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.vegetables = 0
    card.vegetables = 2

    card.buyVegetable(game, dennis)

    expect(dennis.food).toBe(2)
    expect(dennis.vegetables).toBe(0)
  })

  test('has allowsAnytimeAction flag', () => {
    const card = res.getCardById('seed-trader-d114')
    expect(card.allowsAnytimeAction).toBe(true)
  })
})
