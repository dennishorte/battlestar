const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Shovel Bearer (OccA 140)', () => {
  test('gives food equal to clay on hollow when using clay pit', () => {
    const card = res.getCardById('shovel-bearer-a140')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getAccumulatedResources = (space) => {
      if (space === 'take-clay-2') {
        return { clay: 4 }
      }
      return {}
    }

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.food).toBe(4)
  })

  test('gives food equal to clay on clay pit when using hollow', () => {
    const card = res.getCardById('shovel-bearer-a140')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getAccumulatedResources = (space) => {
      if (space === 'take-clay') {
        return { clay: 3 }
      }
      return {}
    }

    card.onAction(game, dennis, 'take-clay-2')

    expect(dennis.food).toBe(3)
  })

  test('does not give food when other space has no clay', () => {
    const card = res.getCardById('shovel-bearer-a140')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getAccumulatedResources = () => ({ clay: 0 })

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.food).toBe(0)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('shovel-bearer-a140')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getAccumulatedResources = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.getAccumulatedResources).not.toHaveBeenCalled()
    expect(dennis.food).toBe(0)
  })
})
