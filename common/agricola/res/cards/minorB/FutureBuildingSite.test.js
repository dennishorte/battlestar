const res = require('../../index.js')

describe('Future Building Site (B038)', () => {
  test('has futureBuildingSiteRestriction flag', () => {
    const card = res.getCardById('future-building-site-b038')
    expect(card.futureBuildingSiteRestriction).toBe(true)
  })

  test('has 3 VPs', () => {
    const card = res.getCardById('future-building-site-b038')
    expect(card.vps).toBe(3)
  })

  test('requires max round 4', () => {
    const card = res.getCardById('future-building-site-b038')
    expect(card.prereqs.maxRound).toBe(4)
  })

  test('has no cost', () => {
    const card = res.getCardById('future-building-site-b038')
    expect(card.cost).toEqual({})
  })
})
