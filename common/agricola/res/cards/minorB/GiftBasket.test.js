const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Gift Basket (B073)', () => {
  test('gives 1 vegetable with 2 rooms', () => {
    const card = res.getCardById('gift-basket-b073')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(2)

    card.onPlay(game, dennis)

    expect(dennis.vegetables).toBe(1)
  })

  test('gives 1 food with 3 rooms', () => {
    const card = res.getCardById('gift-basket-b073')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(3)

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(1)
  })

  test('gives 1 grain with 4 rooms', () => {
    const card = res.getCardById('gift-basket-b073')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(4)

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('gives 1 vegetable with 5 rooms', () => {
    const card = res.getCardById('gift-basket-b073')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(5)

    card.onPlay(game, dennis)

    expect(dennis.vegetables).toBe(1)
  })

  test('gives nothing with 1 room', () => {
    const card = res.getCardById('gift-basket-b073')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.grain = 0
    dennis.vegetables = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(1)

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(0)
    expect(dennis.grain).toBe(0)
    expect(dennis.vegetables).toBe(0)
  })

  test('has 1 VP', () => {
    const card = res.getCardById('gift-basket-b073')
    expect(card.vps).toBe(1)
  })

  test('requires 3 occupations', () => {
    const card = res.getCardById('gift-basket-b073')
    expect(card.prereqs.occupations).toBe(3)
  })
})
