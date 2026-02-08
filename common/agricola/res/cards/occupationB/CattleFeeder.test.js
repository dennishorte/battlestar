const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cattle Feeder (B166)', () => {
  test('offers buy cattle when using Grain Seeds action with food and capacity', () => {
    const card = res.getCardById('cattle-feeder-b166')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    game.actions = { offerBuyAnimal: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerBuyAnimal).toHaveBeenCalledWith(dennis, card, 'cattle', 1)
  })

  test('does not offer buy cattle when no food', () => {
    const card = res.getCardById('cattle-feeder-b166')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    game.actions = { offerBuyAnimal: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerBuyAnimal).not.toHaveBeenCalled()
  })

  test('does not offer buy cattle when cannot place animals', () => {
    const card = res.getCardById('cattle-feeder-b166')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(false)
    game.actions = { offerBuyAnimal: jest.fn() }

    card.onAction(game, dennis, 'take-grain')

    expect(game.actions.offerBuyAnimal).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('cattle-feeder-b166')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    game.actions = { offerBuyAnimal: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerBuyAnimal).not.toHaveBeenCalled()
  })
})
