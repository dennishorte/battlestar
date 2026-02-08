const res = require('../../index.js')

describe('Retraining (D027)', () => {
  test('offers retraining on renovate', () => {
    const card = res.getCardById('retraining-d027')
    const offerRetrainingCalled = []
    const game = {
      actions: {
        offerRetraining: (player, cardArg) => {
          offerRetrainingCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { name: 'dennis' }

    card.onRenovate(game, player)

    expect(offerRetrainingCalled).toHaveLength(1)
    expect(offerRetrainingCalled[0].player).toBe(player)
    expect(offerRetrainingCalled[0].card).toBe(card)
  })

  test('has correct properties', () => {
    const card = res.getCardById('retraining-d027')
    expect(card.cost).toEqual({ food: 1 })
    expect(card.vps).toBe(1)
    expect(card.prereqs).toEqual({ occupations: 1 })
  })
})
