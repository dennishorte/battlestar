const res = require('../../index.js')

describe('Forest School (A028)', () => {
  test('allows ignoring lessons occupied', () => {
    const card = res.getCardById('forest-school-a028')
    expect(card.allowIgnoreLessonsOccupied).toBe(true)
  })

  test('modifies occupation cost to allow wood for food', () => {
    const card = res.getCardById('forest-school-a028')
    const player = {}
    const cost = { food: 2 }

    const modifiedCost = card.modifyOccupationCost(player, cost)

    expect(modifiedCost.food).toBe(0)
    expect(modifiedCost.woodOrFood).toBe(2)
  })

  test('does not modify cost without food', () => {
    const card = res.getCardById('forest-school-a028')
    const player = {}
    const cost = { wood: 1 }

    const modifiedCost = card.modifyOccupationCost(player, cost)

    expect(modifiedCost).toEqual({ wood: 1 })
  })

  test('has correct cost and vps', () => {
    const card = res.getCardById('forest-school-a028')
    expect(card.cost).toEqual({ wood: 1, clay: 1 })
    expect(card.vps).toBe(1)
  })
})
