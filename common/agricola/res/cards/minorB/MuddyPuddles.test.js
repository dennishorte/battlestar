const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Muddy Puddles (B083)', () => {
  test('places stack of goods on play', () => {
    const card = res.getCardById('muddy-puddles-b083')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.muddyPuddlesStack).toEqual(['boar', 'food', 'cattle', 'food', 'sheep'])
  })

  test('allows anytime purchase', () => {
    const card = res.getCardById('muddy-puddles-b083')
    expect(card.allowsAnytimePurchase).toBe(true)
  })

  test('has muddyPuddlesPurchase flag', () => {
    const card = res.getCardById('muddy-puddles-b083')
    expect(card.muddyPuddlesPurchase).toBe(true)
  })

  test('costs 2 clay', () => {
    const card = res.getCardById('muddy-puddles-b083')
    expect(card.cost).toEqual({ clay: 2 })
  })
})
