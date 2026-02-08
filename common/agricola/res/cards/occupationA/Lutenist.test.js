const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Lutenist (OccA 160)', () => {
  test('gives 1 food and 1 wood when another player uses traveling players', () => {
    const card = res.getCardById('lutenist-a160')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 0
    dennis.wood = 0
    game.getAnytimeFoodConversionOptions = () => []
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onAnyAction(game, micah, 'traveling-players', dennis)

    expect(dennis.food).toBe(1)
    expect(dennis.wood).toBe(1)
  })

  test('offers to buy vegetable when player has 2+ food after bonus', () => {
    const card = res.getCardById('lutenist-a160')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 1 // Will be 2 after the +1 bonus
    dennis.wood = 0
    game.getAnytimeFoodConversionOptions = () => []
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onAnyAction(game, micah, 'traveling-players', dennis)

    expect(game.actions.offerBuyVegetable).toHaveBeenCalledWith(dennis, card, 2)
  })

  test('does not offer vegetable purchase when food is too low', () => {
    const card = res.getCardById('lutenist-a160')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 0 // Will be 1 after the +1 bonus - not enough
    dennis.wood = 0
    game.getAnytimeFoodConversionOptions = () => []
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onAnyAction(game, micah, 'traveling-players', dennis)

    expect(game.actions.offerBuyVegetable).not.toHaveBeenCalled()
  })

  test('offers vegetable purchase with conversion options available', () => {
    const card = res.getCardById('lutenist-a160')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 0
    dennis.wood = 0
    game.getAnytimeFoodConversionOptions = () => [{ id: 'some-conversion' }]
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onAnyAction(game, micah, 'traveling-players', dennis)

    expect(game.actions.offerBuyVegetable).toHaveBeenCalledWith(dennis, card, 2)
  })

  test('does not trigger when card owner uses traveling players', () => {
    const card = res.getCardById('lutenist-a160')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    dennis.wood = 0
    game.getAnytimeFoodConversionOptions = () => []
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onAnyAction(game, dennis, 'traveling-players', dennis)

    expect(dennis.food).toBe(5) // Unchanged
    expect(dennis.wood).toBe(0)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('lutenist-a160')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.food = 5
    dennis.wood = 0
    game.actions = { offerBuyVegetable: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(dennis.food).toBe(5)
    expect(dennis.wood).toBe(0)
  })
})
