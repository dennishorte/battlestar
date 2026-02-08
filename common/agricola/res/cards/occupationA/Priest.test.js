const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Priest (OccA 125)', () => {
  test('gives resources in clay house with exactly 2 rooms', () => {
    const card = res.getCardById('priest-a125')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.getRoomCount = () => 2
    dennis.clay = 0
    dennis.reed = 0
    dennis.stone = 0

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(3)
    expect(dennis.reed).toBe(2)
    expect(dennis.stone).toBe(2)
  })

  test('does not give resources in wooden house', () => {
    const card = res.getCardById('priest-a125')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'wood'
    dennis.getRoomCount = () => 2
    dennis.clay = 0
    dennis.reed = 0
    dennis.stone = 0

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(0)
    expect(dennis.reed).toBe(0)
    expect(dennis.stone).toBe(0)
  })

  test('does not give resources in stone house', () => {
    const card = res.getCardById('priest-a125')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.getRoomCount = () => 2
    dennis.clay = 0
    dennis.reed = 0
    dennis.stone = 0

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(0)
    expect(dennis.reed).toBe(0)
    expect(dennis.stone).toBe(0)
  })

  test('does not give resources with more than 2 rooms', () => {
    const card = res.getCardById('priest-a125')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.getRoomCount = () => 3
    dennis.clay = 0
    dennis.reed = 0
    dennis.stone = 0

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(0)
    expect(dennis.reed).toBe(0)
    expect(dennis.stone).toBe(0)
  })

  test('does not give resources with fewer than 2 rooms', () => {
    const card = res.getCardById('priest-a125')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.getRoomCount = () => 1
    dennis.clay = 0
    dennis.reed = 0
    dennis.stone = 0

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(0)
    expect(dennis.reed).toBe(0)
    expect(dennis.stone).toBe(0)
  })
})
