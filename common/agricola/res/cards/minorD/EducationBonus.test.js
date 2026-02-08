const res = require('../../index.js')

describe('Education Bonus (D042)', () => {
  test('gives grain after 1st occupation', () => {
    const card = res.getCardById('education-bonus-d042')
    const player = {
      occupationsPlayed: 1,
      grain: 0,
      addResource: function(type, amount) {
        this[type] = (this[type] || 0) + amount
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onPlayOccupation(game, player)

    expect(player.grain).toBe(1)
  })

  test('gives clay after 2nd occupation', () => {
    const card = res.getCardById('education-bonus-d042')
    const player = {
      occupationsPlayed: 2,
      clay: 0,
      addResource: function(type, amount) {
        this[type] = (this[type] || 0) + amount
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onPlayOccupation(game, player)

    expect(player.clay).toBe(1)
  })

  test('gives reed after 3rd occupation', () => {
    const card = res.getCardById('education-bonus-d042')
    const player = {
      occupationsPlayed: 3,
      reed: 0,
      addResource: function(type, amount) {
        this[type] = (this[type] || 0) + amount
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onPlayOccupation(game, player)

    expect(player.reed).toBe(1)
  })

  test('gives stone after 4th occupation', () => {
    const card = res.getCardById('education-bonus-d042')
    const player = {
      occupationsPlayed: 4,
      stone: 0,
      addResource: function(type, amount) {
        this[type] = (this[type] || 0) + amount
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onPlayOccupation(game, player)

    expect(player.stone).toBe(1)
  })

  test('gives vegetables after 5th occupation', () => {
    const card = res.getCardById('education-bonus-d042')
    const player = {
      occupationsPlayed: 5,
      vegetables: 0,
      addResource: function(type, amount) {
        this[type] = (this[type] || 0) + amount
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onPlayOccupation(game, player)

    expect(player.vegetables).toBe(1)
  })

  test('triggers plow field action after 6th occupation', () => {
    const card = res.getCardById('education-bonus-d042')
    const player = { occupationsPlayed: 6 }
    const plowFieldCalled = []
    const game = {
      actions: {
        plowField: (p, opts) => {
          plowFieldCalled.push({ player: p, opts })
        },
      },
      log: { add: jest.fn() },
    }

    card.onPlayOccupation(game, player)

    expect(plowFieldCalled).toHaveLength(1)
    expect(plowFieldCalled[0].opts).toEqual({ immediate: true })
  })

  test('does nothing after 7th occupation', () => {
    const card = res.getCardById('education-bonus-d042')
    const player = {
      occupationsPlayed: 7,
      addResource: jest.fn(),
    }
    const game = {
      actions: { plowField: jest.fn() },
      log: { add: jest.fn() },
    }

    card.onPlayOccupation(game, player)

    expect(player.addResource).not.toHaveBeenCalled()
    expect(game.actions.plowField).not.toHaveBeenCalled()
  })

  test('has correct properties', () => {
    const card = res.getCardById('education-bonus-d042')
    expect(card.cost).toEqual({ food: 1 })
    expect(card.prereqs).toEqual({ improvements: 2 })
  })
})
