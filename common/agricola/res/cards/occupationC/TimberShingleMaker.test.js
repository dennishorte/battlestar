const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Timber Shingle Maker (C132)', () => {
  test('offers wood placement when renovating to stone with wood', () => {
    const card = res.getCardById('timber-shingle-maker-c132')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    game.actions = { offerTimberShingleMakerPlacement: jest.fn() }

    card.onRenovate(game, dennis, 'clay', 'stone')

    expect(game.actions.offerTimberShingleMakerPlacement).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when renovating to clay', () => {
    const card = res.getCardById('timber-shingle-maker-c132')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    game.actions = { offerTimberShingleMakerPlacement: jest.fn() }

    card.onRenovate(game, dennis, 'wood', 'clay')

    expect(game.actions.offerTimberShingleMakerPlacement).not.toHaveBeenCalled()
  })

  test('does not offer when player has no wood', () => {
    const card = res.getCardById('timber-shingle-maker-c132')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.actions = { offerTimberShingleMakerPlacement: jest.fn() }

    card.onRenovate(game, dennis, 'clay', 'stone')

    expect(game.actions.offerTimberShingleMakerPlacement).not.toHaveBeenCalled()
  })

  test('gives bonus points equal to placed wood', () => {
    const card = res.getCardById('timber-shingle-maker-c132')

    const mockPlayer = {
      timberShingleMakerWood: 4,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(4)
  })

  test('gives 0 points when no wood placed', () => {
    const card = res.getCardById('timber-shingle-maker-c132')

    const mockPlayer = {
      timberShingleMakerWood: 0,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })

  test('gives 0 points when property undefined', () => {
    const card = res.getCardById('timber-shingle-maker-c132')

    const mockPlayer = {}

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })
})
