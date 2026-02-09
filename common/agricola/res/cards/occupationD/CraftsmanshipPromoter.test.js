const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Craftsmanship Promoter (OccD 131)', () => {
  test('gives 1 stone on play', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onPlay(game, dennis)

    expect(dennis.stone).toBe(1)
  })

  test('has allowsMajorOnMinorAction flag', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowsMajorOnMinorAction).toBe(true)
  })

  test('allows clay-oven as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('clay-oven')
  })

  test('allows stone-oven as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('stone-oven')
  })

  test('allows joinery as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('joinery')
  })

  test('allows pottery as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('pottery')
  })

  test('allows basketmakers-workshop as major on minor action', () => {
    const card = res.getCardById('craftsmanship-promoter-d131')
    expect(card.allowedMajors).toContain('basketmakers-workshop')
  })
})
