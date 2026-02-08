const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Emissary (OccD 124)', () => {
  test('initializes empty placedGoods array on play', () => {
    const card = res.getCardById('emissary-d124')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.placedGoods).toEqual([])
  })

  test('can place good when player has resource and not already placed', () => {
    const card = res.getCardById('emissary-d124')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    card.placedGoods = []

    expect(card.canPlaceGood(dennis, 'wood')).toBe(true)
  })

  test('cannot place good when already placed that type', () => {
    const card = res.getCardById('emissary-d124')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    card.placedGoods = ['wood']

    expect(card.canPlaceGood(dennis, 'wood')).toBe(false)
  })

  test('cannot place good when player does not have resource', () => {
    const card = res.getCardById('emissary-d124')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    card.placedGoods = []

    expect(card.canPlaceGood(dennis, 'wood')).toBe(false)
  })

  test('placeGood exchanges 1 good for 1 stone', () => {
    const card = res.getCardById('emissary-d124')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    dennis.stone = 0
    card.placedGoods = []

    card.placeGood(game, dennis, 'wood')

    expect(dennis.wood).toBe(2)
    expect(dennis.stone).toBe(1)
    expect(card.placedGoods).toContain('wood')
  })

  test('can place multiple different goods', () => {
    const card = res.getCardById('emissary-d124')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.clay = 1
    dennis.food = 1
    dennis.stone = 0
    card.placedGoods = []

    card.placeGood(game, dennis, 'wood')
    card.placeGood(game, dennis, 'clay')

    expect(dennis.stone).toBe(2)
    expect(card.placedGoods).toContain('wood')
    expect(card.placedGoods).toContain('clay')
    expect(card.canPlaceGood(dennis, 'food')).toBe(true)
  })

  test('has allowsAnytimeAction flag', () => {
    const card = res.getCardById('emissary-d124')
    expect(card.allowsAnytimeAction).toBe(true)
  })
})
