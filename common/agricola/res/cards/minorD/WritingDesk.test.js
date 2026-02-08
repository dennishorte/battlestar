const res = require('../../index.js')

describe('Writing Desk (D028)', () => {
  test('offers additional occupation on lessons-1 action', () => {
    const card = res.getCardById('writing-desk-d028')
    const offerOccupationForFoodCalled = []
    const game = {
      actions: {
        offerOccupationForFood: (player, cardArg, foodCost) => {
          offerOccupationForFoodCalled.push({ player, card: cardArg, foodCost })
        },
      },
    }
    const player = { name: 'dennis' }

    card.onAction(game, player, 'lessons-1')

    expect(offerOccupationForFoodCalled).toHaveLength(1)
    expect(offerOccupationForFoodCalled[0].foodCost).toBe(2)
  })

  test('offers additional occupation on lessons-2 action', () => {
    const card = res.getCardById('writing-desk-d028')
    const offerOccupationForFoodCalled = []
    const game = {
      actions: {
        offerOccupationForFood: (player, cardArg, foodCost) => {
          offerOccupationForFoodCalled.push({ player, card: cardArg, foodCost })
        },
      },
    }
    const player = { name: 'dennis' }

    card.onAction(game, player, 'lessons-2')

    expect(offerOccupationForFoodCalled).toHaveLength(1)
    expect(offerOccupationForFoodCalled[0].foodCost).toBe(2)
  })

  test('does not offer on other actions', () => {
    const card = res.getCardById('writing-desk-d028')
    const offerOccupationForFoodCalled = []
    const game = {
      actions: {
        offerOccupationForFood: (player, cardArg, foodCost) => {
          offerOccupationForFoodCalled.push({ player, card: cardArg, foodCost })
        },
      },
    }
    const player = { name: 'dennis' }

    card.onAction(game, player, 'take-wood')

    expect(offerOccupationForFoodCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('writing-desk-d028')
    expect(card.cost).toEqual({ wood: 1 })
    expect(card.vps).toBe(1)
    expect(card.prereqs).toEqual({ occupations: 2 })
  })
})
