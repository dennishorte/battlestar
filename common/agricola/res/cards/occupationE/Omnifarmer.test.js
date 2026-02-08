const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Omnifarmer (E134)', () => {
  test('initializes goods array and exchanged flag on play', () => {
    const card = res.getCardById('omnifarmer-e134')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.goods).toEqual([])
    expect(card.exchanged).toBe(false)
  })

  test('offers placement at harvest', () => {
    const card = res.getCardById('omnifarmer-e134')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerOmnifarmerPlace = jest.fn()
    game.actions.offerOmnifarmerPlace = offerOmnifarmerPlace

    card.onHarvest(game, dennis)

    expect(offerOmnifarmerPlace).toHaveBeenCalledWith(dennis, card)
  })

  test('can exchange when not exchanged and has 2+ goods', () => {
    const card = res.getCardById('omnifarmer-e134')

    card.exchanged = false
    card.goods = ['grain', 'vegetables']

    expect(card.canExchange()).toBe(true)
  })

  test('cannot exchange when already exchanged', () => {
    const card = res.getCardById('omnifarmer-e134')

    card.exchanged = true
    card.goods = ['grain', 'vegetables']

    expect(card.canExchange()).toBe(false)
  })

  test('cannot exchange when has fewer than 2 goods', () => {
    const card = res.getCardById('omnifarmer-e134')

    card.exchanged = false
    card.goods = ['grain']

    expect(card.canExchange()).toBe(false)
  })

  test('exchange gives 3 points for 2 unique goods', () => {
    const card = res.getCardById('omnifarmer-e134')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.exchanged = false
    card.goods = ['grain', 'vegetables']

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    card.exchange(game, dennis)

    expect(dennis.bonusPoints).toBe(3)
    expect(card.exchanged).toBe(true)
  })

  test('exchange gives 5 points for 3 unique goods', () => {
    const card = res.getCardById('omnifarmer-e134')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.exchanged = false
    card.goods = ['grain', 'vegetables', 'sheep']

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    card.exchange(game, dennis)

    expect(dennis.bonusPoints).toBe(5)
  })

  test('exchange gives 7 points for 4 unique goods', () => {
    const card = res.getCardById('omnifarmer-e134')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.exchanged = false
    card.goods = ['grain', 'vegetables', 'sheep', 'boar']

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    card.exchange(game, dennis)

    expect(dennis.bonusPoints).toBe(7)
  })

  test('exchange gives 9 points for 5+ unique goods', () => {
    const card = res.getCardById('omnifarmer-e134')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.exchanged = false
    card.goods = ['grain', 'vegetables', 'sheep', 'boar', 'cattle']

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    card.exchange(game, dennis)

    expect(dennis.bonusPoints).toBe(9)
  })
})
