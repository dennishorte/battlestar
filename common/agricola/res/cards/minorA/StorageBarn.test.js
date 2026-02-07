const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Storage Barn (A006)', () => {
  test('gives resources based on owned major improvements', () => {
    const card = res.getCardById('storage-barn-a006')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    // Create mock player with controlled properties
    const resources = { stone: 0, wood: 0, clay: 0, reed: 0 }
    const mockPlayer = {
      majorImprovements: ['well', 'joinery', 'pottery', 'basketmakers-workshop'],
      addResource(type, amount) {
        resources[type] = (resources[type] || 0) + amount
      },
    }

    card.onPlay(game, mockPlayer)

    expect(resources.stone).toBe(1)
    expect(resources.wood).toBe(1)
    expect(resources.clay).toBe(1)
    expect(resources.reed).toBe(1)
  })

  test('gives stone for Well only', () => {
    const card = res.getCardById('storage-barn-a006')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const resources = { stone: 0, wood: 0, clay: 0, reed: 0 }
    const mockPlayer = {
      majorImprovements: ['well'],
      addResource(type, amount) {
        resources[type] = (resources[type] || 0) + amount
      },
    }

    card.onPlay(game, mockPlayer)

    expect(resources.stone).toBe(1)
    expect(resources.wood).toBe(0)
    expect(resources.clay).toBe(0)
    expect(resources.reed).toBe(0)
  })

  test('gives nothing without matching improvements', () => {
    const card = res.getCardById('storage-barn-a006')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const resources = { stone: 0 }
    const mockPlayer = {
      majorImprovements: [],
      addResource(type, amount) {
        resources[type] = (resources[type] || 0) + amount
      },
    }

    card.onPlay(game, mockPlayer)

    expect(resources.stone).toBe(0)
  })
})
