const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Chief Forester (OccA 115)', () => {
  test('offers sow action when using take-wood', () => {
    const card = res.getCardById('chief-forester-a115')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerSowSingleField: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerSowSingleField).toHaveBeenCalledWith(dennis, card)
  })

  test('offers sow action when using copse', () => {
    const card = res.getCardById('chief-forester-a115')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerSowSingleField: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerSowSingleField).toHaveBeenCalledWith(dennis, card)
  })

  test('offers sow action when using take-3-wood', () => {
    const card = res.getCardById('chief-forester-a115')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerSowSingleField: jest.fn() }

    card.onAction(game, dennis, 'take-3-wood')

    expect(game.actions.offerSowSingleField).toHaveBeenCalledWith(dennis, card)
  })

  test('offers sow action when using take-2-wood', () => {
    const card = res.getCardById('chief-forester-a115')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerSowSingleField: jest.fn() }

    card.onAction(game, dennis, 'take-2-wood')

    expect(game.actions.offerSowSingleField).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('chief-forester-a115')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerSowSingleField: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerSowSingleField).not.toHaveBeenCalled()
  })
})
