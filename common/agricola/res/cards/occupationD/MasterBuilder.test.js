const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Master Builder (OccD 087)', () => {
  test('initializes used flag to false on play', () => {
    const card = res.getCardById('master-builder-d087')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.used).toBe(false)
  })

  test('can use free room when player has 5+ rooms and not used', () => {
    const card = res.getCardById('master-builder-d087')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getRoomCount = () => 5
    card.used = false

    expect(card.canUseFreeRoom(dennis)).toBe(true)
  })

  test('cannot use free room when player has less than 5 rooms', () => {
    const card = res.getCardById('master-builder-d087')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getRoomCount = () => 4
    card.used = false

    expect(card.canUseFreeRoom(dennis)).toBe(false)
  })

  test('cannot use free room when already used', () => {
    const card = res.getCardById('master-builder-d087')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getRoomCount = () => 5
    card.used = true

    expect(card.canUseFreeRoom(dennis)).toBe(false)
  })

  test('useFreeRoom sets used flag and offers action', () => {
    const card = res.getCardById('master-builder-d087')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.used = false
    game.actions = { buildFreeRoom: jest.fn() }

    card.useFreeRoom(game, dennis)

    expect(card.used).toBe(true)
    expect(game.actions.buildFreeRoom).toHaveBeenCalledWith(dennis, card)
  })

  test('has allowsAnytimeAction flag', () => {
    const card = res.getCardById('master-builder-d087')
    expect(card.allowsAnytimeAction).toBe(true)
  })
})
