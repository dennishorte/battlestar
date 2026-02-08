const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Animal Reeve (OccA 135)', () => {
  test('gives 4 wood when played with 9+ rounds left', () => {
    const card = res.getCardById('animal-reeve-a135')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 5 // 14 - 5 = 9 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(4)
  })

  test('gives 3 wood when played with 6-8 rounds left', () => {
    const card = res.getCardById('animal-reeve-a135')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 8 // 14 - 8 = 6 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(3)
  })

  test('gives 2 wood when played with 3-5 rounds left', () => {
    const card = res.getCardById('animal-reeve-a135')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 11 // 14 - 11 = 3 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('gives 1 wood when played with 1-2 rounds left', () => {
    const card = res.getCardById('animal-reeve-a135')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 13 // 14 - 13 = 1 round left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('gives no wood when played in round 14', () => {
    const card = res.getCardById('animal-reeve-a135')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 14 // 0 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(0)
  })

  test('gives 5 bonus points for players with 4+ of each animal type', () => {
    const card = res.getCardById('animal-reeve-a135')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = (type) => {
      if (type === 'sheep') {
        return 4
      }
      if (type === 'boar') {
        return 5
      }
      if (type === 'cattle') {
        return 4
      }
      return 0
    }

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(5)
  })

  test('gives 3 bonus points for players with 3+ of each animal type', () => {
    const card = res.getCardById('animal-reeve-a135')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = (type) => {
      if (type === 'sheep') {
        return 3
      }
      if (type === 'boar') {
        return 5
      }
      if (type === 'cattle') {
        return 3
      }
      return 0
    }

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(3)
  })

  test('gives 1 bonus point for players with 2+ of each animal type', () => {
    const card = res.getCardById('animal-reeve-a135')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = (type) => {
      if (type === 'sheep') {
        return 2
      }
      if (type === 'boar') {
        return 3
      }
      if (type === 'cattle') {
        return 2
      }
      return 0
    }

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(1)
  })

  test('gives no bonus for players with fewer than 2 of any animal type', () => {
    const card = res.getCardById('animal-reeve-a135')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getTotalAnimals = (type) => {
      if (type === 'sheep') {
        return 5
      }
      if (type === 'boar') {
        return 1
      }
      if (type === 'cattle') {
        return 3
      }
      return 0
    }

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBeUndefined()
  })
})
