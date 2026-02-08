const res = require('../../index.js')

describe('Herbal Garden (E036)', () => {
  test('requires an empty pasture', () => {
    const card = res.getCardById('herbal-garden-e036')
    expect(card.requiresEmptyPasture).toBe(true)
  })

  test('has 2 vps', () => {
    const card = res.getCardById('herbal-garden-e036')
    expect(card.vps).toBe(2)
  })

  test('requires 1 pasture as prereq', () => {
    const card = res.getCardById('herbal-garden-e036')
    expect(card.prereqs.pastures).toBe(1)
  })
})
