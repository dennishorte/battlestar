const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Animal Dealer (OccA 147)', () => {
  test('offers to buy sheep when using sheep market with food', () => {
    const card = res.getCardById('animal-dealer-a147')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.getAnytimeFoodConversionOptions = () => []
    game.actions = { offerBuyAnimal: jest.fn() }

    card.onAction(game, dennis, 'take-sheep')

    expect(game.actions.offerBuyAnimal).toHaveBeenCalledWith(dennis, card, 'sheep')
  })

  test('offers to buy boar when using pig market with food', () => {
    const card = res.getCardById('animal-dealer-a147')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.getAnytimeFoodConversionOptions = () => []
    game.actions = { offerBuyAnimal: jest.fn() }

    card.onAction(game, dennis, 'take-boar')

    expect(game.actions.offerBuyAnimal).toHaveBeenCalledWith(dennis, card, 'boar')
  })

  test('offers to buy cattle when using cattle market with food', () => {
    const card = res.getCardById('animal-dealer-a147')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    game.getAnytimeFoodConversionOptions = () => []
    game.actions = { offerBuyAnimal: jest.fn() }

    card.onAction(game, dennis, 'take-cattle')

    expect(game.actions.offerBuyAnimal).toHaveBeenCalledWith(dennis, card, 'cattle')
  })

  test('does not offer to buy animal without food or conversion options', () => {
    const card = res.getCardById('animal-dealer-a147')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getAnytimeFoodConversionOptions = () => []
    game.actions = { offerBuyAnimal: jest.fn() }

    card.onAction(game, dennis, 'take-sheep')

    expect(game.actions.offerBuyAnimal).not.toHaveBeenCalled()
  })

  test('offers with food conversion options available', () => {
    const card = res.getCardById('animal-dealer-a147')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getAnytimeFoodConversionOptions = () => [{ id: 'some-conversion' }]
    game.actions = { offerBuyAnimal: jest.fn() }

    card.onAction(game, dennis, 'take-sheep')

    expect(game.actions.offerBuyAnimal).toHaveBeenCalledWith(dennis, card, 'sheep')
  })
})
