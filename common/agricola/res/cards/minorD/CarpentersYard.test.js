const res = require('../../index.js')

describe("Carpenter's Yard (D026)", () => {
  test('allows Joinery and Well on minor action', () => {
    const card = res.getCardById('carpenters-yard-d026')
    expect(card.allowsMajorsOnMinorAction).toEqual(['joinery', 'well'])
  })

  test('allows both Joinery and Well on single major action', () => {
    const card = res.getCardById('carpenters-yard-d026')
    expect(card.allowsBothMajorsOnMajorAction).toEqual(['joinery', 'well'])
  })

  test('has correct properties', () => {
    const card = res.getCardById('carpenters-yard-d026')
    expect(card.cost).toEqual({ wood: 1, reed: 1 })
    expect(card.vps).toBe(1)
  })
})
