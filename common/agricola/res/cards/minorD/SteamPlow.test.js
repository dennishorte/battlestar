const res = require('../../index.js')

describe('Steam Plow (D018)', () => {
  test('offers steam plow when player has enough resources', () => {
    const card = res.getCardById('steam-plow-d018')
    const offerSteamPlowCalled = []
    const game = {
      actions: {
        offerSteamPlow: (player, cardArg) => {
          offerSteamPlowCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { wood: 2, food: 1 }

    card.onReturnHome(game, player)

    expect(offerSteamPlowCalled).toHaveLength(1)
    expect(offerSteamPlowCalled[0].player).toBe(player)
    expect(offerSteamPlowCalled[0].card).toBe(card)
  })

  test('does not offer steam plow when not enough wood', () => {
    const card = res.getCardById('steam-plow-d018')
    const offerSteamPlowCalled = []
    const game = {
      actions: {
        offerSteamPlow: (player, cardArg) => {
          offerSteamPlowCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { wood: 1, food: 1 }

    card.onReturnHome(game, player)

    expect(offerSteamPlowCalled).toHaveLength(0)
  })

  test('does not offer steam plow when not enough food', () => {
    const card = res.getCardById('steam-plow-d018')
    const offerSteamPlowCalled = []
    const game = {
      actions: {
        offerSteamPlow: (player, cardArg) => {
          offerSteamPlowCalled.push({ player, card: cardArg })
        },
      },
    }
    const player = { wood: 2, food: 0 }

    card.onReturnHome(game, player)

    expect(offerSteamPlowCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('steam-plow-d018')
    expect(card.cost).toEqual({ wood: 1, food: 1 })
    expect(card.vps).toBe(1)
  })
})
