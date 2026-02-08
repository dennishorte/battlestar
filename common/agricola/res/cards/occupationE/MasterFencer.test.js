const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Master Fencer (E088)', () => {
  test('offers fence building when in stone house with enough wood', () => {
    const card = res.getCardById('master-fencer-e088')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.wood = 3

    const offerMasterFencerBuild = jest.fn()
    game.actions.offerMasterFencerBuild = offerMasterFencerBuild

    card.onRoundStart(game, dennis)

    expect(offerMasterFencerBuild).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer fence building when not in stone house', () => {
    const card = res.getCardById('master-fencer-e088')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.wood = 3

    const offerMasterFencerBuild = jest.fn()
    game.actions.offerMasterFencerBuild = offerMasterFencerBuild

    card.onRoundStart(game, dennis)

    expect(offerMasterFencerBuild).not.toHaveBeenCalled()
  })

  test('does not offer fence building when insufficient wood', () => {
    const card = res.getCardById('master-fencer-e088')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.wood = 1

    const offerMasterFencerBuild = jest.fn()
    game.actions.offerMasterFencerBuild = offerMasterFencerBuild

    card.onRoundStart(game, dennis)

    expect(offerMasterFencerBuild).not.toHaveBeenCalled()
  })
})
