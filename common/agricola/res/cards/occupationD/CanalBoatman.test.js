const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Canal Boatman (OccD 103)', () => {
  test('offers placement when using fishing with available worker and food', () => {
    const card = res.getCardById('canal-boatman-d103')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    dennis.hasAvailableWorker = () => true
    game.actions = { offerCanalBoatmanPlacement: jest.fn() }

    card.onAction(game, dennis, 'fishing')

    expect(game.actions.offerCanalBoatmanPlacement).toHaveBeenCalledWith(dennis, card)
  })

  test('offers placement when using reed-bank with available worker and food', () => {
    const card = res.getCardById('canal-boatman-d103')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    dennis.hasAvailableWorker = () => true
    game.actions = { offerCanalBoatmanPlacement: jest.fn() }

    card.onAction(game, dennis, 'reed-bank')

    expect(game.actions.offerCanalBoatmanPlacement).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer placement without food', () => {
    const card = res.getCardById('canal-boatman-d103')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.hasAvailableWorker = () => true
    game.actions = { offerCanalBoatmanPlacement: jest.fn() }

    card.onAction(game, dennis, 'fishing')

    expect(game.actions.offerCanalBoatmanPlacement).not.toHaveBeenCalled()
  })

  test('does not offer placement without available worker', () => {
    const card = res.getCardById('canal-boatman-d103')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    dennis.hasAvailableWorker = () => false
    game.actions = { offerCanalBoatmanPlacement: jest.fn() }

    card.onAction(game, dennis, 'fishing')

    expect(game.actions.offerCanalBoatmanPlacement).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('canal-boatman-d103')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    dennis.hasAvailableWorker = () => true
    game.actions = { offerCanalBoatmanPlacement: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerCanalBoatmanPlacement).not.toHaveBeenCalled()
  })
})
