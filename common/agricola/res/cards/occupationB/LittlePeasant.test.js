const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Little Peasant (B151)', () => {
  test('gives 1 stone on play', () => {
    const card = res.getCardById('little-peasant-b151')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    card.onPlay(game, dennis)

    expect(dennis.stone).toBe(1)
  })

  test('ignores occupancy when in wooden house with 2 rooms', () => {
    const card = res.getCardById('little-peasant-b151')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'wood'
    dennis.getRoomCount = jest.fn().mockReturnValue(2)

    const result = card.ignoresOccupancy(dennis)

    expect(result).toBe(true)
  })

  test('does not ignore occupancy when in clay house', () => {
    const card = res.getCardById('little-peasant-b151')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.getRoomCount = jest.fn().mockReturnValue(2)

    const result = card.ignoresOccupancy(dennis)

    expect(result).toBe(false)
  })

  test('does not ignore occupancy when more than 2 rooms', () => {
    const card = res.getCardById('little-peasant-b151')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'wood'
    dennis.getRoomCount = jest.fn().mockReturnValue(3)

    const result = card.ignoresOccupancy(dennis)

    expect(result).toBe(false)
  })

  test('has excludeFromIgnore for meeting-place', () => {
    const card = res.getCardById('little-peasant-b151')
    expect(card.excludeFromIgnore).toContain('meeting-place')
  })
})
