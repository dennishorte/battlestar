const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Hayloft Barn (B021)', () => {
  test('places 4 food on card on play', () => {
    const card = res.getCardById('hayloft-barn-b021')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.hayloftBarnFood).toBe(4)
  })

  test('gives 1 food when gaining grain', () => {
    const card = res.getCardById('hayloft-barn-b021')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.hayloftBarnFood = 4

    card.onGainGrain(game, dennis)

    expect(dennis.food).toBe(1)
    expect(dennis.hayloftBarnFood).toBe(3)
  })

  test('triggers family growth when card runs out', () => {
    const card = res.getCardById('hayloft-barn-b021')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.hayloftBarnFood = 1
    game.actions.familyGrowthWithoutRoom = jest.fn()

    card.onGainGrain(game, dennis)

    expect(dennis.food).toBe(1)
    expect(dennis.hayloftBarnFood).toBe(0)
    expect(game.actions.familyGrowthWithoutRoom).toHaveBeenCalledWith(dennis, { fromCard: true })
  })

  test('does not give food when card is empty', () => {
    const card = res.getCardById('hayloft-barn-b021')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.hayloftBarnFood = 0

    card.onGainGrain(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('requires 1 occupation', () => {
    const card = res.getCardById('hayloft-barn-b021')
    expect(card.prereqs.occupations).toBe(1)
  })

  test('costs 3 wood', () => {
    const card = res.getCardById('hayloft-barn-b021')
    expect(card.cost).toEqual({ wood: 3 })
  })
})
