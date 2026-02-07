const res = require('../../index.js')

describe("Stork's Nest (D010)", () => {
  test('has onReturnHome hook', () => {
    const card = res.getCardById('storks-nest-d010')
    expect(card.onReturnHome).toBeDefined()
    expect(card.cost).toEqual({ reed: 1 })
    expect(card.prereqs).toEqual({ occupations: 5 })
  })
})
