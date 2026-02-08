const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Angler (OccA 095)', () => {
  test('offers improvement action when fishing with at most 2 food on space', () => {
    const card = res.getCardById('angler-a095')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.getAccumulatedResources = () => ({ food: 2 })
    game.actions = { offerImprovementAction: jest.fn() }

    card.onAction(game, dennis, 'fishing')

    expect(game.actions.offerImprovementAction).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer improvement action when fishing with more than 2 food', () => {
    const card = res.getCardById('angler-a095')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.getAccumulatedResources = () => ({ food: 3 })
    game.actions = { offerImprovementAction: jest.fn() }

    card.onAction(game, dennis, 'fishing')

    expect(game.actions.offerImprovementAction).not.toHaveBeenCalled()
  })

  test('does not trigger for non-fishing actions', () => {
    const card = res.getCardById('angler-a095')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.getAccumulatedResources = () => ({ food: 1 })
    game.actions = { offerImprovementAction: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerImprovementAction).not.toHaveBeenCalled()
  })
})
