const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Carter (E140)', () => {
  test('sets active round to next round on play', () => {
    const card = res.getCardById('carter-e140')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.activeRound).toBe(6)
  })

  test('gives food for building resources on building resource space during active round', () => {
    const card = res.getCardById('carter-e140')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 6

    card.activeRound = 6
    game.isBuildingResourceAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ wood: 2, clay: 3 })

    const dennis = t.player(game)
    dennis.food = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'food') {
        dennis.food += amount
      }
    })

    card.onAction(game, dennis, 'forest')

    expect(dennis.addResource).toHaveBeenCalledWith('food', 5)
  })

  test('does not give food on non-active round', () => {
    const card = res.getCardById('carter-e140')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 7

    card.activeRound = 6
    game.isBuildingResourceAccumulationSpace = () => true
    game.getAccumulatedResources = () => ({ wood: 2 })

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'forest')

    expect(dennis.addResource).not.toHaveBeenCalled()
  })

  test('does not give food on non-building resource space', () => {
    const card = res.getCardById('carter-e140')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 6

    card.activeRound = 6
    game.isBuildingResourceAccumulationSpace = () => false

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'fishing')

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
