const res = require('../../index.js')

describe('Supply Boat (D073)', () => {
  test('offers supply boat when using fishing action with at least 1 food', () => {
    const card = res.getCardById('supply-boat-d073')
    const offerSupplyBoatCalled = []
    const game = {
      actions: {
        offerSupplyBoat: (player, cardArg) => {
          offerSupplyBoatCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { food: 1 }

    card.onAction(game, player, 'fishing')

    expect(offerSupplyBoatCalled).toHaveLength(1)
    expect(offerSupplyBoatCalled[0].player).toBe(player)
    expect(offerSupplyBoatCalled[0].card).toBe(card)
  })

  test('does not offer supply boat when player has no food', () => {
    const card = res.getCardById('supply-boat-d073')
    const offerSupplyBoatCalled = []
    const game = {
      actions: {
        offerSupplyBoat: (player, cardArg) => {
          offerSupplyBoatCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { food: 0 }

    card.onAction(game, player, 'fishing')

    expect(offerSupplyBoatCalled).toHaveLength(0)
  })

  test('does not offer supply boat for other actions', () => {
    const card = res.getCardById('supply-boat-d073')
    const offerSupplyBoatCalled = []
    const game = {
      actions: {
        offerSupplyBoat: (player, cardArg) => {
          offerSupplyBoatCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { food: 5 }

    card.onAction(game, player, 'take-wood')

    expect(offerSupplyBoatCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('supply-boat-d073')
    expect(card.cost).toEqual({ wood: 1 })
    expect(card.vps).toBe(1)
    expect(card.prereqs).toEqual({ occupations: 1 })
  })
})
