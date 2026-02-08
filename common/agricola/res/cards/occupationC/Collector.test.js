const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Collector (C104)', () => {
  test('is an action space for owner only', () => {
    const card = res.getCardById('collector-c104')

    expect(card.isActionSpace).toBe(true)
    expect(card.actionSpaceForOwnerOnly).toBe(true)
  })

  test('initializes use count on play', () => {
    const card = res.getCardById('collector-c104')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.useCount).toBe(0)
  })

  test('gives 6 goods and 1 begging marker on first use', () => {
    const card = res.getCardById('collector-c104')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.useCount = 0
    dennis.beggingMarkers = 0
    game.actions = { offerChooseGoods: jest.fn() }

    card.actionSpaceEffect(game, dennis)

    expect(card.useCount).toBe(1)
    expect(dennis.beggingMarkers).toBe(1)
    expect(game.actions.offerChooseGoods).toHaveBeenCalledWith(dennis, card, 6)
  })

  test('gives 7 goods on second use', () => {
    const card = res.getCardById('collector-c104')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.useCount = 1
    dennis.beggingMarkers = 0
    game.actions = { offerChooseGoods: jest.fn() }

    card.actionSpaceEffect(game, dennis)

    expect(card.useCount).toBe(2)
    expect(game.actions.offerChooseGoods).toHaveBeenCalledWith(dennis, card, 7)
  })

  test('gives 8 goods on third use', () => {
    const card = res.getCardById('collector-c104')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.useCount = 2
    dennis.beggingMarkers = 0
    game.actions = { offerChooseGoods: jest.fn() }

    card.actionSpaceEffect(game, dennis)

    expect(card.useCount).toBe(3)
    expect(game.actions.offerChooseGoods).toHaveBeenCalledWith(dennis, card, 8)
  })

  test('gives 9 goods on fourth use', () => {
    const card = res.getCardById('collector-c104')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    card.useCount = 3
    dennis.beggingMarkers = 0
    game.actions = { offerChooseGoods: jest.fn() }

    card.actionSpaceEffect(game, dennis)

    expect(card.useCount).toBe(4)
    expect(game.actions.offerChooseGoods).toHaveBeenCalledWith(dennis, card, 9)
  })
})
