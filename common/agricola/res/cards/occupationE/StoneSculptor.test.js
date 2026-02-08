const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stone Sculptor (E153)', () => {
  test('offers conversion when player has stone at harvest', () => {
    const card = res.getCardById('stone-sculptor-e153')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 2

    const offerStoneSculptorConversion = jest.fn()
    game.actions.offerStoneSculptorConversion = offerStoneSculptorConversion

    card.onHarvest(game, dennis)

    expect(offerStoneSculptorConversion).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer conversion when player has no stone', () => {
    const card = res.getCardById('stone-sculptor-e153')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    const offerStoneSculptorConversion = jest.fn()
    game.actions.offerStoneSculptorConversion = offerStoneSculptorConversion

    card.onHarvest(game, dennis)

    expect(offerStoneSculptorConversion).not.toHaveBeenCalled()
  })
})
