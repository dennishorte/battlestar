const res = require('../../index.js')

describe('Stone House Reconstruction (E013)', () => {
  test('enables anytime renovation from clay to stone', () => {
    const card = res.getCardById('stone-house-reconstruction-e013')
    expect(card.enablesAnytimeRenovation).toBe('clayToStone')
  })

  test('has 1 vps', () => {
    const card = res.getCardById('stone-house-reconstruction-e013')
    expect(card.vps).toBe(1)
  })

  test('costs 1 stone', () => {
    const card = res.getCardById('stone-house-reconstruction-e013')
    expect(card.cost.stone).toBe(1)
  })
})
