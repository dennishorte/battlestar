const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Tax Collector (E126)', () => {
  test('offers choice at round start when in stone house', () => {
    const card = res.getCardById('tax-collector-e126')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'

    const offerTaxCollectorChoice = jest.fn()
    game.actions.offerTaxCollectorChoice = offerTaxCollectorChoice

    card.onRoundStart(game, dennis)

    expect(offerTaxCollectorChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer choice when not in stone house', () => {
    const card = res.getCardById('tax-collector-e126')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'

    const offerTaxCollectorChoice = jest.fn()
    game.actions.offerTaxCollectorChoice = offerTaxCollectorChoice

    card.onRoundStart(game, dennis)

    expect(offerTaxCollectorChoice).not.toHaveBeenCalled()
  })
})
