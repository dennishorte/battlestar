const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Constable (C135)', () => {
  test('gives 4 wood when 9 or more rounds left', () => {
    const card = res.getCardById('constable-c135')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state = { round: 5 } // 14 - 5 = 9 rounds left
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(4)
  })

  test('gives 3 wood when 6-8 rounds left', () => {
    const card = res.getCardById('constable-c135')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state = { round: 8 } // 14 - 8 = 6 rounds left
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(3)
  })

  test('gives 2 wood when 3-5 rounds left', () => {
    const card = res.getCardById('constable-c135')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state = { round: 11 } // 14 - 11 = 3 rounds left
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('gives 1 wood when 1-2 rounds left', () => {
    const card = res.getCardById('constable-c135')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state = { round: 13 } // 14 - 13 = 1 round left
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('gives 0 wood when 0 rounds left', () => {
    const card = res.getCardById('constable-c135')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state = { round: 14 } // 14 - 14 = 0 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(0)
  })

  test('gives 3 bonus points to players without negative points', () => {
    const card = res.getCardById('constable-c135')

    const mockPlayer1 = {
      name: 'player1',
      hasNegativePoints: () => false,
    }
    const mockPlayer2 = {
      name: 'player2',
      hasNegativePoints: () => true,
    }
    const mockPlayer3 = {
      name: 'player3',
      hasNegativePoints: () => false,
    }

    const mockGame = {
      players: {
        all: () => [mockPlayer1, mockPlayer2, mockPlayer3],
      },
    }

    const bonuses = card.getEndGamePointsAllPlayers(mockGame)

    expect(bonuses.player1).toBe(3)
    expect(bonuses.player2).toBeUndefined()
    expect(bonuses.player3).toBe(3)
  })
})
