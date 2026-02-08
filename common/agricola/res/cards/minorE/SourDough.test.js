const res = require('../../index.js')

describe('Sour Dough (E062)', () => {
  test('enables skip placement for bake', () => {
    const card = res.getCardById('sour-dough-e062')
    expect(card.enablesSkipPlacementForBake).toBe(true)
  })

  test('has 1 vps', () => {
    const card = res.getCardById('sour-dough-e062')
    expect(card.vps).toBe(1)
  })

  test('requires 3 occupations and baking improvement as prereqs', () => {
    const card = res.getCardById('sour-dough-e062')
    expect(card.prereqs.occupations).toBe(3)
    expect(card.prereqs.bakingImprovement).toBe(true)
  })
})
