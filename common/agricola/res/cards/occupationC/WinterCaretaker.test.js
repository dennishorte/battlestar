const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Winter Caretaker (C113)', () => {
  test('gives 1 grain on play', () => {
    const card = res.getCardById('winter-caretaker-c113')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('offers to buy vegetable at harvest end when player has 2+ food', () => {
    const card = res.getCardById('winter-caretaker-c113')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onHarvestEnd(game, dennis)

    expect(game.actions.offerBuyVegetable).toHaveBeenCalledWith(dennis, card, 2)
  })

  test('does not offer when player has less than 2 food', () => {
    const card = res.getCardById('winter-caretaker-c113')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onHarvestEnd(game, dennis)

    expect(game.actions.offerBuyVegetable).not.toHaveBeenCalled()
  })
})
