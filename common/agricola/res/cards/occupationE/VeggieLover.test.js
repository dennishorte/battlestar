const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Veggie Lover (E132)', () => {
  test('offers harvest conversion when player has grain and vegetables', () => {
    const card = res.getCardById('veggie-lover-e132')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 2
    dennis.vegetables = 1

    const offerVeggieLoverHarvestConversion = jest.fn()
    game.actions.offerVeggieLoverHarvestConversion = offerVeggieLoverHarvestConversion

    card.onHarvest(game, dennis)

    expect(offerVeggieLoverHarvestConversion).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer harvest conversion when player has no grain', () => {
    const card = res.getCardById('veggie-lover-e132')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.vegetables = 1

    const offerVeggieLoverHarvestConversion = jest.fn()
    game.actions.offerVeggieLoverHarvestConversion = offerVeggieLoverHarvestConversion

    card.onHarvest(game, dennis)

    expect(offerVeggieLoverHarvestConversion).not.toHaveBeenCalled()
  })

  test('does not offer harvest conversion when player has no vegetables', () => {
    const card = res.getCardById('veggie-lover-e132')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 2
    dennis.vegetables = 0

    const offerVeggieLoverHarvestConversion = jest.fn()
    game.actions.offerVeggieLoverHarvestConversion = offerVeggieLoverHarvestConversion

    card.onHarvest(game, dennis)

    expect(offerVeggieLoverHarvestConversion).not.toHaveBeenCalled()
  })

  test('offers scoring conversion', () => {
    const card = res.getCardById('veggie-lover-e132')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerVeggieLoverScoringConversion = jest.fn()
    game.actions.offerVeggieLoverScoringConversion = offerVeggieLoverScoringConversion

    card.onScoring(game, dennis)

    expect(offerVeggieLoverScoringConversion).toHaveBeenCalledWith(dennis, card)
  })
})
