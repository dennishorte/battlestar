const res = require('../../index.js')

describe('Pioneering Spirit (D023)', () => {
  test('offers renovation in rounds 3-5', () => {
    const card = res.getCardById('pioneering-spirit-d023')
    const offerRenovationCalled = []
    const game = {
      actions: {
        offerRenovation: (player, cardArg) => {
          offerRenovationCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { name: 'dennis' }

    card.onActionSpaceUsed(game, player, 3)
    expect(offerRenovationCalled).toHaveLength(1)

    card.onActionSpaceUsed(game, player, 5)
    expect(offerRenovationCalled).toHaveLength(2)
  })

  test('offers choice in rounds 6-8', () => {
    const card = res.getCardById('pioneering-spirit-d023')
    const offerChoiceCalled = []
    const game = {
      actions: {
        offerPioneeringSpiritChoice: (player, cardArg) => {
          offerChoiceCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { name: 'dennis' }

    card.onActionSpaceUsed(game, player, 6)
    expect(offerChoiceCalled).toHaveLength(1)

    card.onActionSpaceUsed(game, player, 8)
    expect(offerChoiceCalled).toHaveLength(2)
  })

  test('does nothing in other rounds', () => {
    const card = res.getCardById('pioneering-spirit-d023')
    const game = {
      actions: {
        offerRenovation: jest.fn(),
        offerPioneeringSpiritChoice: jest.fn(),
      },
    }
    const player = { name: 'dennis' }

    card.onActionSpaceUsed(game, player, 2)
    card.onActionSpaceUsed(game, player, 9)

    expect(game.actions.offerRenovation).not.toHaveBeenCalled()
    expect(game.actions.offerPioneeringSpiritChoice).not.toHaveBeenCalled()
  })

  test('has correct properties', () => {
    const card = res.getCardById('pioneering-spirit-d023')
    expect(card.providesActionSpace).toBe(true)
    expect(card.ownerOnly).toBe(true)
    expect(card.actionSpaceId).toBe('pioneering-spirit')
    expect(card.cost).toEqual({})
  })
})
