const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Fisherman's Friend (C159)", () => {
  test('gives food when traveling players has more food than fishing', () => {
    const card = res.getCardById('fishermans-friend-c159')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getAccumulatedResources = (actionId) => {
      if (actionId === 'traveling-players') {
        return { food: 5 }
      }
      if (actionId === 'fishing') {
        return { food: 2 }
      }
      return {}
    }
    game.log = { add: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(dennis.food).toBe(3) // 5 - 2 = 3
  })

  test('gives no food when fishing has more or equal food', () => {
    const card = res.getCardById('fishermans-friend-c159')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getAccumulatedResources = (actionId) => {
      if (actionId === 'traveling-players') {
        return { food: 2 }
      }
      if (actionId === 'fishing') {
        return { food: 3 }
      }
      return {}
    }

    card.onRoundStart(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('handles missing food values', () => {
    const card = res.getCardById('fishermans-friend-c159')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.getAccumulatedResources = () => ({})

    card.onRoundStart(game, dennis)

    expect(dennis.food).toBe(0)
  })
})
