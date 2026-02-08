const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Grocer (OccA 102)', () => {
  test('sets up goods pile on play', () => {
    const card = res.getCardById('grocer-a102')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.grocerGoods).toEqual([
      'wood', 'grain', 'reed', 'stone', 'vegetables', 'clay', 'reed', 'vegetables'
    ])
  })

  test('has allowsAnytimePurchase flag', () => {
    const card = res.getCardById('grocer-a102')

    expect(card.allowsAnytimePurchase).toBe(true)
  })
})
