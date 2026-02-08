const res = require('../../index.js')

describe('Turnwrest Plow (D020)', () => {
  test('places 2 field charges on play', () => {
    const card = res.getCardById('turnwrest-plow-d020')
    const player = {}
    const game = { log: { add: jest.fn() } }

    card.onPlay(game, player)

    expect(player.turnwrestPlowCharges).toBe(2)
  })

  test('uses charges to plow fields on farmland action', () => {
    const card = res.getCardById('turnwrest-plow-d020')
    const plowFieldCalled = []
    const game = {
      actions: {
        plowField: (player, opts) => {
          plowFieldCalled.push({ player, opts })
        },
      },
    }
    const player = { turnwrestPlowCharges: 2 }

    card.onAction(game, player, 'plow-field')

    expect(plowFieldCalled).toHaveLength(2)
    expect(player.turnwrestPlowCharges).toBe(0)
  })

  test('uses charges to plow fields on plow-sow action', () => {
    const card = res.getCardById('turnwrest-plow-d020')
    const plowFieldCalled = []
    const game = {
      actions: {
        plowField: (player, opts) => {
          plowFieldCalled.push({ player, opts })
        },
      },
    }
    const player = { turnwrestPlowCharges: 2 }

    card.onAction(game, player, 'plow-sow')

    expect(plowFieldCalled).toHaveLength(2)
    expect(player.turnwrestPlowCharges).toBe(0)
  })

  test('uses remaining charges only', () => {
    const card = res.getCardById('turnwrest-plow-d020')
    const plowFieldCalled = []
    const game = {
      actions: {
        plowField: (player, opts) => {
          plowFieldCalled.push({ player, opts })
        },
      },
    }
    const player = { turnwrestPlowCharges: 1 }

    card.onAction(game, player, 'plow-field')

    expect(plowFieldCalled).toHaveLength(1)
    expect(player.turnwrestPlowCharges).toBe(0)
  })

  test('does not plow when no charges left', () => {
    const card = res.getCardById('turnwrest-plow-d020')
    const plowFieldCalled = []
    const game = {
      actions: {
        plowField: (player, opts) => {
          plowFieldCalled.push({ player, opts })
        },
      },
    }
    const player = { turnwrestPlowCharges: 0 }

    card.onAction(game, player, 'plow-field')

    expect(plowFieldCalled).toHaveLength(0)
  })

  test('does not trigger on other actions', () => {
    const card = res.getCardById('turnwrest-plow-d020')
    const plowFieldCalled = []
    const game = {
      actions: {
        plowField: (player, opts) => {
          plowFieldCalled.push({ player, opts })
        },
      },
    }
    const player = { turnwrestPlowCharges: 2 }

    card.onAction(game, player, 'take-wood')

    expect(plowFieldCalled).toHaveLength(0)
    expect(player.turnwrestPlowCharges).toBe(2)
  })

  test('has correct properties', () => {
    const card = res.getCardById('turnwrest-plow-d020')
    expect(card.cost).toEqual({ wood: 3 })
    expect(card.prereqs).toEqual({ occupations: 2 })
  })
})
