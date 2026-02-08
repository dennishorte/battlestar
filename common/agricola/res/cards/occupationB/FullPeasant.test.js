const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Full Peasant (B130)', () => {
  test('offers fencing when using sow-bake and fencing is unoccupied', () => {
    const card = res.getCardById('full-peasant-b130')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'sow-bake')

    expect(game.actions.offerUseOtherSpace).toHaveBeenCalledWith(
      dennis, card, 'fencing', { cost: { food: 1 } }
    )
  })

  test('offers sow-bake when using fencing and sow-bake is unoccupied', () => {
    const card = res.getCardById('full-peasant-b130')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'fencing')

    expect(game.actions.offerUseOtherSpace).toHaveBeenCalledWith(
      dennis, card, 'sow-bake', { cost: { food: 1 } }
    )
  })

  test('does not offer when other space is occupied', () => {
    const card = res.getCardById('full-peasant-b130')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn().mockReturnValue(true)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'sow-bake')

    expect(game.actions.offerUseOtherSpace).not.toHaveBeenCalled()
  })

  test('does not offer when player has no food', () => {
    const card = res.getCardById('full-peasant-b130')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'sow-bake')

    expect(game.actions.offerUseOtherSpace).not.toHaveBeenCalled()
  })
})
