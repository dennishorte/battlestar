const res = require('../../index.js')

describe('Pulverizer Plow (D019)', () => {
  test('offers plow option when using clay action with at least 1 clay', () => {
    const card = res.getCardById('pulverizer-plow-d019')
    const offerPulverizerPlowCalled = []
    const game = {
      actions: {
        offerPulverizerPlow: (player, cardArg, actionId) => {
          offerPulverizerPlowCalled.push({ player, card: cardArg, actionId })
        },
      },
    }
    const player = { clay: 1 }

    card.onAction(game, player, 'take-clay')

    expect(offerPulverizerPlowCalled).toHaveLength(1)
    expect(offerPulverizerPlowCalled[0].actionId).toBe('take-clay')
  })

  test('offers plow option when using take-clay-2 action', () => {
    const card = res.getCardById('pulverizer-plow-d019')
    const offerPulverizerPlowCalled = []
    const game = {
      actions: {
        offerPulverizerPlow: (player, cardArg, actionId) => {
          offerPulverizerPlowCalled.push({ player, card: cardArg, actionId })
        },
      },
    }
    const player = { clay: 2 }

    card.onAction(game, player, 'take-clay-2')

    expect(offerPulverizerPlowCalled).toHaveLength(1)
    expect(offerPulverizerPlowCalled[0].actionId).toBe('take-clay-2')
  })

  test('does not offer plow when player has no clay', () => {
    const card = res.getCardById('pulverizer-plow-d019')
    const offerPulverizerPlowCalled = []
    const game = {
      actions: {
        offerPulverizerPlow: (player, cardArg, actionId) => {
          offerPulverizerPlowCalled.push({ player, card: cardArg, actionId })
        },
      },
    }
    const player = { clay: 0 }

    card.onAction(game, player, 'take-clay')

    expect(offerPulverizerPlowCalled).toHaveLength(0)
  })

  test('does not offer plow for non-clay actions', () => {
    const card = res.getCardById('pulverizer-plow-d019')
    const offerPulverizerPlowCalled = []
    const game = {
      actions: {
        offerPulverizerPlow: (player, cardArg, actionId) => {
          offerPulverizerPlowCalled.push({ player, card: cardArg, actionId })
        },
      },
    }
    const player = { clay: 5 }

    card.onAction(game, player, 'take-wood')

    expect(offerPulverizerPlowCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('pulverizer-plow-d019')
    expect(card.cost).toEqual({ wood: 2 })
    expect(card.prereqs).toEqual({ occupations: 1 })
  })
})
