const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Established Person (B088)', () => {
  test('offers free renovation and fences when player has exactly 2 rooms and can renovate', () => {
    const card = res.getCardById('established-person-b088')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getRoomCount = jest.fn().mockReturnValue(2)
    dennis.canRenovate = jest.fn().mockReturnValue(true)
    game.actions = {
      freeRenovation: jest.fn(),
      offerBuildFences: jest.fn(),
    }

    card.onPlay(game, dennis)

    expect(game.actions.freeRenovation).toHaveBeenCalledWith(dennis, card)
    expect(game.actions.offerBuildFences).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger when more than 2 rooms', () => {
    const card = res.getCardById('established-person-b088')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getRoomCount = jest.fn().mockReturnValue(3)
    dennis.canRenovate = jest.fn().mockReturnValue(true)
    game.actions = {
      freeRenovation: jest.fn(),
      offerBuildFences: jest.fn(),
    }

    card.onPlay(game, dennis)

    expect(game.actions.freeRenovation).not.toHaveBeenCalled()
    expect(game.actions.offerBuildFences).not.toHaveBeenCalled()
  })

  test('does not trigger when cannot renovate', () => {
    const card = res.getCardById('established-person-b088')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getRoomCount = jest.fn().mockReturnValue(2)
    dennis.canRenovate = jest.fn().mockReturnValue(false)
    game.actions = {
      freeRenovation: jest.fn(),
      offerBuildFences: jest.fn(),
    }

    card.onPlay(game, dennis)

    expect(game.actions.freeRenovation).not.toHaveBeenCalled()
    expect(game.actions.offerBuildFences).not.toHaveBeenCalled()
  })
})
