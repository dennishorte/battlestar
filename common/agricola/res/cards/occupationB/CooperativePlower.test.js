const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cooperative Plower (B090)', () => {
  test('offers additional plow when Farmland is used and Grain Seeds is occupied', () => {
    const card = res.getCardById('cooperative-plower-b090')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.isActionOccupied = jest.fn().mockReturnValue(true)
    game.actions = { offerAdditionalPlow: jest.fn() }

    card.onAction(game, dennis, 'plow-field')

    expect(game.isActionOccupied).toHaveBeenCalledWith('take-grain')
    expect(game.actions.offerAdditionalPlow).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer additional plow when Grain Seeds is not occupied', () => {
    const card = res.getCardById('cooperative-plower-b090')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerAdditionalPlow: jest.fn() }

    card.onAction(game, dennis, 'plow-field')

    expect(game.actions.offerAdditionalPlow).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('cooperative-plower-b090')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.isActionOccupied = jest.fn().mockReturnValue(true)
    game.actions = { offerAdditionalPlow: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerAdditionalPlow).not.toHaveBeenCalled()
  })
})
