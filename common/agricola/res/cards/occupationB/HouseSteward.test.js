const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('House Steward (B136)', () => {
  test('gives 4 wood when 9+ rounds left', () => {
    const card = res.getCardById('house-steward-b136')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()
    game.state.round = 5

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(4)
  })

  test('gives 3 wood when 6-8 rounds left', () => {
    const card = res.getCardById('house-steward-b136')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()
    game.state.round = 8

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(3)
  })

  test('gives 2 wood when 3-5 rounds left', () => {
    const card = res.getCardById('house-steward-b136')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()
    game.state.round = 11

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('gives 1 wood when 1-2 rounds left', () => {
    const card = res.getCardById('house-steward-b136')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()
    game.state.round = 13

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('gives 3 bonus points to players with most rooms at end game', () => {
    const card = res.getCardById('house-steward-b136')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    const scott = t.player(game, 'scott')
    dennis.getRoomCount = jest.fn().mockReturnValue(4)
    micah.getRoomCount = jest.fn().mockReturnValue(4)
    scott.getRoomCount = jest.fn().mockReturnValue(3)

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(3)
    expect(bonuses.micah).toBe(3)
    expect(bonuses.scott).toBeUndefined()
  })
})
