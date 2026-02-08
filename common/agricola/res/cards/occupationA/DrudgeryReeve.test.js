const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Drudgery Reeve (OccA 136)', () => {
  test('gives 4 wood when played with 9+ rounds left', () => {
    const card = res.getCardById('drudgery-reeve-a136')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 5 // 14 - 5 = 9 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(4)
  })

  test('gives 3 wood when played with 6-8 rounds left', () => {
    const card = res.getCardById('drudgery-reeve-a136')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 8 // 14 - 8 = 6 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(3)
  })

  test('gives 2 wood when played with 3-5 rounds left', () => {
    const card = res.getCardById('drudgery-reeve-a136')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 11 // 14 - 11 = 3 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('gives no wood when played with fewer than 3 rounds left', () => {
    const card = res.getCardById('drudgery-reeve-a136')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 12 // 14 - 12 = 2 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(0)
  })

  test('gives 5 bonus points for players with 3+ of each building resource', () => {
    const card = res.getCardById('drudgery-reeve-a136')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    dennis.clay = 4
    dennis.reed = 3
    dennis.stone = 5

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(5)
  })

  test('gives 3 bonus points for players with 2+ of each building resource', () => {
    const card = res.getCardById('drudgery-reeve-a136')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 2
    dennis.clay = 3
    dennis.reed = 2
    dennis.stone = 4

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(3)
  })

  test('gives 1 bonus point for players with 1+ of each building resource', () => {
    const card = res.getCardById('drudgery-reeve-a136')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.clay = 2
    dennis.reed = 1
    dennis.stone = 3

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(1)
  })

  test('gives no bonus for players missing any building resource', () => {
    const card = res.getCardById('drudgery-reeve-a136')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    dennis.clay = 0
    dennis.reed = 3
    dennis.stone = 2

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBeUndefined()
  })
})
