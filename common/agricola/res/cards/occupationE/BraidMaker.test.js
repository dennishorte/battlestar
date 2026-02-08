const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Braid Maker (E109)', () => {
  test('offers conversion when player has reed at harvest', () => {
    const card = res.getCardById('braid-maker-e109')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 2

    const offerBraidMakerConversion = jest.fn()
    game.actions.offerBraidMakerConversion = offerBraidMakerConversion

    card.onHarvest(game, dennis)

    expect(offerBraidMakerConversion).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer conversion when player has no reed', () => {
    const card = res.getCardById('braid-maker-e109')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0

    const offerBraidMakerConversion = jest.fn()
    game.actions.offerBraidMakerConversion = offerBraidMakerConversion

    card.onHarvest(game, dennis)

    expect(offerBraidMakerConversion).not.toHaveBeenCalled()
  })

  test('allows building Basketmakers Workshop on minor improvement action', () => {
    const card = res.getCardById('braid-maker-e109')

    expect(card.allowsMajorOnMinorAction).toBe(true)
    expect(card.allowedMajors).toContain('basketmakers-workshop')
  })

  test('modifies Basketmakers Workshop cost', () => {
    const card = res.getCardById('braid-maker-e109')
    const mockPlayer = {}

    const modifiedCost = card.modifyMajorCost(mockPlayer, 'basketmakers-workshop', { reed: 2, stone: 2 })

    expect(modifiedCost).toEqual({ reed: 1, stone: 1 })
  })

  test('does not modify other major improvement costs', () => {
    const card = res.getCardById('braid-maker-e109')
    const mockPlayer = {}
    const originalCost = { clay: 5 }

    const modifiedCost = card.modifyMajorCost(mockPlayer, 'fireplace', originalCost)

    expect(modifiedCost).toBe(originalCost)
  })
})
