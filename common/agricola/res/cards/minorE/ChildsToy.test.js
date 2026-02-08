const res = require('../../index.js')

describe('Child\'s Toy (E030)', () => {
  test('modifies newborn food cost to 2', () => {
    const card = res.getCardById('childs-toy-e030')

    const result = card.modifyNewbornFoodCost(null, null, 1)

    expect(result).toBe(2)
  })

  test('has 2 vps', () => {
    const card = res.getCardById('childs-toy-e030')
    expect(card.vps).toBe(2)
  })

  test('requires exactly 2 adults as prereq', () => {
    const card = res.getCardById('childs-toy-e030')
    expect(card.prereqs.exactlyAdults).toBe(2)
  })
})
