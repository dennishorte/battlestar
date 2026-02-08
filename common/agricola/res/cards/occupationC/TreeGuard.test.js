const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Tree Guard (C102)', () => {
  test('offers exchange when using take-wood action with 4+ wood', () => {
    const card = res.getCardById('tree-guard-c102')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    game.actions = { offerTreeGuardExchange: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerTreeGuardExchange).toHaveBeenCalledWith(dennis, card, 'take-wood')
  })

  test('offers exchange when using copse action with 4+ wood', () => {
    const card = res.getCardById('tree-guard-c102')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 4
    game.actions = { offerTreeGuardExchange: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerTreeGuardExchange).toHaveBeenCalledWith(dennis, card, 'copse')
  })

  test('offers exchange when using take-3-wood action', () => {
    const card = res.getCardById('tree-guard-c102')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 6
    game.actions = { offerTreeGuardExchange: jest.fn() }

    card.onAction(game, dennis, 'take-3-wood')

    expect(game.actions.offerTreeGuardExchange).toHaveBeenCalledWith(dennis, card, 'take-3-wood')
  })

  test('offers exchange when using take-2-wood action', () => {
    const card = res.getCardById('tree-guard-c102')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 4
    game.actions = { offerTreeGuardExchange: jest.fn() }

    card.onAction(game, dennis, 'take-2-wood')

    expect(game.actions.offerTreeGuardExchange).toHaveBeenCalledWith(dennis, card, 'take-2-wood')
  })

  test('does not offer exchange when player has less than 4 wood', () => {
    const card = res.getCardById('tree-guard-c102')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    game.actions = { offerTreeGuardExchange: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerTreeGuardExchange).not.toHaveBeenCalled()
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('tree-guard-c102')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 10
    game.actions = { offerTreeGuardExchange: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerTreeGuardExchange).not.toHaveBeenCalled()
  })
})
