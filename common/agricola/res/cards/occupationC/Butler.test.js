const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Butler (C100)', () => {
  test('tracks if played early (round 11 or before)', () => {
    const card = res.getCardById('butler-c100')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.state = { round: 10 }

    card.onPlay(game, dennis)

    expect(card.playedEarly).toBe(true)
  })

  test('tracks if played late (after round 11)', () => {
    const card = res.getCardById('butler-c100')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.state = { round: 12 }

    card.onPlay(game, dennis)

    expect(card.playedEarly).toBe(false)
  })

  test('gives 4 bonus points when played early and more rooms than people', () => {
    const card = res.getCardById('butler-c100')
    card.playedEarly = true

    const mockPlayer = {
      getRoomCount: () => 4,
      getFamilySize: () => 3,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(4)
  })

  test('gives 0 points when played early but not more rooms than people', () => {
    const card = res.getCardById('butler-c100')
    card.playedEarly = true

    const mockPlayer = {
      getRoomCount: () => 3,
      getFamilySize: () => 3,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })

  test('gives 0 points when not played early', () => {
    const card = res.getCardById('butler-c100')
    card.playedEarly = false

    const mockPlayer = {
      getRoomCount: () => 5,
      getFamilySize: () => 2,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })
})
