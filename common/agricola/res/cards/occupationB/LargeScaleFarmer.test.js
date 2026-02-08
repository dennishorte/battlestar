const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Large-Scale Farmer (B150)', () => {
  test('offers major improvement when using farm expansion and major is unoccupied', () => {
    const card = res.getCardById('large-scale-farmer-b150')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'farm-expansion')

    expect(game.actions.offerUseOtherSpace).toHaveBeenCalledWith(
      dennis, card, 'major-improvement', { cost: { food: 1 } }
    )
  })

  test('offers farm expansion when using major improvement and farm expansion is unoccupied', () => {
    const card = res.getCardById('large-scale-farmer-b150')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'major-improvement')

    expect(game.actions.offerUseOtherSpace).toHaveBeenCalledWith(
      dennis, card, 'farm-expansion', { cost: { food: 1 } }
    )
  })

  test('does not offer when other space is occupied', () => {
    const card = res.getCardById('large-scale-farmer-b150')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn().mockReturnValue(true)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'farm-expansion')

    expect(game.actions.offerUseOtherSpace).not.toHaveBeenCalled()
  })

  test('does not offer when no food', () => {
    const card = res.getCardById('large-scale-farmer-b150')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerUseOtherSpace: jest.fn() }

    card.onAction(game, dennis, 'farm-expansion')

    expect(game.actions.offerUseOtherSpace).not.toHaveBeenCalled()
  })
})
