const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Freemason (C123)', () => {
  test('gives 2 clay when living in clay house with 2 rooms', () => {
    const card = res.getCardById('freemason-c123')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.roomType = 'clay'
    dennis.getRoomCount = () => 2
    game.log = { add: jest.fn() }

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.clay).toBe(2)
  })

  test('gives 2 stone when living in stone house with 2 rooms', () => {
    const card = res.getCardById('freemason-c123')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.roomType = 'stone'
    dennis.getRoomCount = () => 2
    game.log = { add: jest.fn() }

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.stone).toBe(2)
  })

  test('does not give resources when living in wood house', () => {
    const card = res.getCardById('freemason-c123')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.stone = 0
    dennis.roomType = 'wood'
    dennis.getRoomCount = () => 2

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.clay).toBe(0)
    expect(dennis.stone).toBe(0)
  })

  test('does not give resources when not exactly 2 rooms', () => {
    const card = res.getCardById('freemason-c123')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.roomType = 'clay'
    dennis.getRoomCount = () => 3

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.clay).toBe(0)
  })
})
