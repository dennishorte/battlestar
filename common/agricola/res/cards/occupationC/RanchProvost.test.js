const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Ranch Provost (C136)', () => {
  test('gives 4 wood when 9 or more rounds left', () => {
    const card = res.getCardById('ranch-provost-c136')
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
    const card = res.getCardById('ranch-provost-c136')
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
    const card = res.getCardById('ranch-provost-c136')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state = { round: 11 } // 14 - 11 = 3 rounds left
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('gives 0 wood when less than 3 rounds left', () => {
    const card = res.getCardById('ranch-provost-c136')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state = { round: 12 } // 14 - 12 = 2 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(0)
  })

  test('gives 3 bonus points to players with highest pasture capacity', () => {
    const card = res.getCardById('ranch-provost-c136')

    const mockPlayer1 = {
      name: 'player1',
      getHighestPastureCapacity: () => 8,
    }
    const mockPlayer2 = {
      name: 'player2',
      getHighestPastureCapacity: () => 4,
    }
    const mockPlayer3 = {
      name: 'player3',
      getHighestPastureCapacity: () => 8,
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
