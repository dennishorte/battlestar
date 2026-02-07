const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Strawberry Patch (B045)', () => {
  test('schedules food for next 3 rounds on play', () => {
    const card = res.getCardById('strawberry-patch-b045')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onPlay(game, dennis)

    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
  })

  test('does not schedule beyond round 14', () => {
    const card = res.getCardById('strawberry-patch-b045')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 13

    card.onPlay(game, dennis)

    expect(game.state.scheduledFood[dennis.name][14]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][15]).toBeUndefined()
  })

  test('has 2 VPs', () => {
    const card = res.getCardById('strawberry-patch-b045')
    expect(card.vps).toBe(2)
  })

  test('requires 2 vegetable fields', () => {
    const card = res.getCardById('strawberry-patch-b045')
    expect(card.prereqs.vegetableFields).toBe(2)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('strawberry-patch-b045')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
