const res = require('../../index.js')

describe('Lumber Mill (A075)', () => {
  test('reduces wood cost of improvements by 1', () => {
    const card = res.getCardById('lumber-mill-a075')
    const modified = card.modifyImprovementCost(null, { wood: 3, clay: 2 })
    expect(modified.wood).toBe(2)
    expect(modified.clay).toBe(2)
  })

  test('does not reduce wood below 0', () => {
    const card = res.getCardById('lumber-mill-a075')
    const modified = card.modifyImprovementCost(null, { clay: 2 })
    // No wood key, so cost unchanged
    expect(modified.clay).toBe(2)
    expect(modified.wood).toBeUndefined()
  })

  test('gives 2 VPs', () => {
    const card = res.getCardById('lumber-mill-a075')
    expect(card.vps).toBe(2)
  })
})
