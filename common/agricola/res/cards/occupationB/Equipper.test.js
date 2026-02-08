const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Equipper (B131)', () => {
  test('offers minor improvement when using take-wood action', () => {
    const card = res.getCardById('equipper-b131')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerPlayMinorImprovement: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerPlayMinorImprovement).toHaveBeenCalledWith(dennis, card)
  })

  test('offers minor improvement when using copse action', () => {
    const card = res.getCardById('equipper-b131')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerPlayMinorImprovement: jest.fn() }

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerPlayMinorImprovement).toHaveBeenCalledWith(dennis, card)
  })

  test('offers minor improvement when using take-3-wood action', () => {
    const card = res.getCardById('equipper-b131')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerPlayMinorImprovement: jest.fn() }

    card.onAction(game, dennis, 'take-3-wood')

    expect(game.actions.offerPlayMinorImprovement).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('equipper-b131')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerPlayMinorImprovement: jest.fn() }

    card.onAction(game, dennis, 'take-clay')

    expect(game.actions.offerPlayMinorImprovement).not.toHaveBeenCalled()
  })
})
