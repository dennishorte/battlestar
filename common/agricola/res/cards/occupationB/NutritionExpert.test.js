const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Nutrition Expert (B135)', () => {
  test('offers exchange when player has required resources', () => {
    const card = res.getCardById('nutrition-expert-b135')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 1
    dennis.vegetables = 1
    dennis.getTotalAnimals = jest.fn().mockReturnValue(2)
    game.actions = { offerNutritionExpertExchange: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerNutritionExpertExchange).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when no grain', () => {
    const card = res.getCardById('nutrition-expert-b135')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.vegetables = 1
    dennis.getTotalAnimals = jest.fn().mockReturnValue(2)
    game.actions = { offerNutritionExpertExchange: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerNutritionExpertExchange).not.toHaveBeenCalled()
  })

  test('does not offer when no vegetables', () => {
    const card = res.getCardById('nutrition-expert-b135')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 1
    dennis.vegetables = 0
    dennis.getTotalAnimals = jest.fn().mockReturnValue(2)
    game.actions = { offerNutritionExpertExchange: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerNutritionExpertExchange).not.toHaveBeenCalled()
  })

  test('does not offer when no animals', () => {
    const card = res.getCardById('nutrition-expert-b135')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 1
    dennis.vegetables = 1
    dennis.getTotalAnimals = jest.fn().mockReturnValue(0)
    game.actions = { offerNutritionExpertExchange: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerNutritionExpertExchange).not.toHaveBeenCalled()
  })
})
