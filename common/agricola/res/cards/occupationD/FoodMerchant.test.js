const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Food Merchant (OccD 113)', () => {
  test('offers to buy vegetable for 3 food when harvesting grain', () => {
    const card = res.getCardById('food-merchant-d113')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onHarvestGrain(game, dennis, 1, false)

    expect(game.actions.offerBuyVegetable).toHaveBeenCalledWith(dennis, card, 3, 1)
  })

  test('offers to buy vegetable for 2 food when harvesting last grain from field', () => {
    const card = res.getCardById('food-merchant-d113')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onHarvestGrain(game, dennis, 1, true)

    expect(game.actions.offerBuyVegetable).toHaveBeenCalledWith(dennis, card, 2, 1)
  })

  test('does not offer when player has less than 3 food for normal harvest', () => {
    const card = res.getCardById('food-merchant-d113')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onHarvestGrain(game, dennis, 1, false)

    expect(game.actions.offerBuyVegetable).not.toHaveBeenCalled()
  })

  test('does not offer when player has less than 2 food for last grain harvest', () => {
    const card = res.getCardById('food-merchant-d113')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onHarvestGrain(game, dennis, 1, true)

    expect(game.actions.offerBuyVegetable).not.toHaveBeenCalled()
  })

  test('passes grain count to offer function', () => {
    const card = res.getCardById('food-merchant-d113')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onHarvestGrain(game, dennis, 3, false)

    expect(game.actions.offerBuyVegetable).toHaveBeenCalledWith(dennis, card, 3, 3)
  })
})
