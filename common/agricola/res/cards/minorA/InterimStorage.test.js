const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Interim Storage (A081)', () => {
  test('initializes storage on play', () => {
    const card = res.getCardById('interim-storage-a081')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.interimStorage).toEqual({ wood: 0, clay: 0, reed: 0 })
  })

  test('stores wood when taking clay', () => {
    const card = res.getCardById('interim-storage-a081')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.interimStorage = { wood: 0, clay: 0, reed: 0 }

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.interimStorage.wood).toBe(1)
  })

  test('stores clay when taking reed', () => {
    const card = res.getCardById('interim-storage-a081')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.interimStorage = { wood: 0, clay: 0, reed: 0 }

    card.onAction(game, dennis, 'take-reed')

    expect(dennis.interimStorage.clay).toBe(1)
  })

  test('stores reed when taking stone', () => {
    const card = res.getCardById('interim-storage-a081')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.interimStorage = { wood: 0, clay: 0, reed: 0 }

    card.onAction(game, dennis, 'take-stone-1')

    expect(dennis.interimStorage.reed).toBe(1)
  })

  test('releases storage at round 7', () => {
    const card = res.getCardById('interim-storage-a081')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 0
    dennis.reed = 0
    dennis.interimStorage = { wood: 2, clay: 3, reed: 1 }

    card.onRoundStart(game, dennis, 7)

    expect(dennis.wood).toBe(2)
    expect(dennis.clay).toBe(3)
    expect(dennis.reed).toBe(1)
    expect(dennis.interimStorage).toEqual({ wood: 0, clay: 0, reed: 0 })
  })

  test('releases storage at round 11', () => {
    const card = res.getCardById('interim-storage-a081')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.interimStorage = { wood: 5, clay: 0, reed: 0 }

    card.onRoundStart(game, dennis, 11)

    expect(dennis.wood).toBe(5)
  })

  test('does not release storage at other rounds', () => {
    const card = res.getCardById('interim-storage-a081')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.interimStorage = { wood: 5, clay: 0, reed: 0 }

    card.onRoundStart(game, dennis, 6)

    expect(dennis.wood).toBe(0)
    expect(dennis.interimStorage.wood).toBe(5)
  })
})
