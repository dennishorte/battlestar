const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Reseller (E146)', () => {
  test('sets used to false on play', () => {
    const card = res.getCardById('reseller-e146')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.used).toBe(false)
  })

  test('offers refund when playing improvement if not used', () => {
    const card = res.getCardById('reseller-e146')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.used = false

    const dennis = t.player(game)
    const improvement = { id: 'test-improvement' }

    const offerResellerRefund = jest.fn()
    game.actions.offerResellerRefund = offerResellerRefund

    card.onPlayImprovement(game, dennis, improvement)

    expect(offerResellerRefund).toHaveBeenCalledWith(dennis, card, improvement)
  })

  test('does not offer refund when playing improvement if already used', () => {
    const card = res.getCardById('reseller-e146')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.used = true

    const dennis = t.player(game)
    const improvement = { id: 'test-improvement' }

    const offerResellerRefund = jest.fn()
    game.actions.offerResellerRefund = offerResellerRefund

    card.onPlayImprovement(game, dennis, improvement)

    expect(offerResellerRefund).not.toHaveBeenCalled()
  })

  test('offers refund when building improvement if not used', () => {
    const card = res.getCardById('reseller-e146')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.used = false

    const dennis = t.player(game)
    const improvement = { id: 'test-improvement' }

    const offerResellerRefund = jest.fn()
    game.actions.offerResellerRefund = offerResellerRefund

    card.onBuildImprovement(game, dennis, improvement)

    expect(offerResellerRefund).toHaveBeenCalledWith(dennis, card, improvement)
  })

  test('does not offer refund when building improvement if already used', () => {
    const card = res.getCardById('reseller-e146')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.used = true

    const dennis = t.player(game)
    const improvement = { id: 'test-improvement' }

    const offerResellerRefund = jest.fn()
    game.actions.offerResellerRefund = offerResellerRefund

    card.onBuildImprovement(game, dennis, improvement)

    expect(offerResellerRefund).not.toHaveBeenCalled()
  })
})
