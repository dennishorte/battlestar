const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pub Owner (B160)', () => {
  test('gives grain on play when all three spaces are occupied', () => {
    const card = res.getCardById('pub-owner-b160')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.isActionOccupied = jest.fn().mockReturnValue(true)

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain on play when not all spaces are occupied', () => {
    const card = res.getCardById('pub-owner-b160')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.isActionOccupied = jest.fn((actionId) => actionId !== 'take-wood')

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(0)
  })

  test('gives grain at work phase end when all three spaces are occupied', () => {
    const card = res.getCardById('pub-owner-b160')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.isActionOccupied = jest.fn().mockReturnValue(true)

    card.onWorkPhaseEnd(game, dennis)

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain at work phase end when not all spaces are occupied', () => {
    const card = res.getCardById('pub-owner-b160')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.isActionOccupied = jest.fn((actionId) => actionId !== 'take-clay')

    card.onWorkPhaseEnd(game, dennis)

    expect(dennis.grain).toBe(0)
  })
})
