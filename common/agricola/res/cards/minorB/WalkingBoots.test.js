const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Walking Boots (B022)', () => {
  test('gives 2 food on play and triggers effect', () => {
    const card = res.getCardById('walking-boots-b022')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.actions.walkingBootsEffect = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(2)
    expect(game.actions.walkingBootsEffect).toHaveBeenCalledWith(dennis, card)
  })

  test('requires max 4 people', () => {
    const card = res.getCardById('walking-boots-b022')
    expect(card.prereqs.maxPeople).toBe(4)
  })

  test('has no cost', () => {
    const card = res.getCardById('walking-boots-b022')
    expect(card.cost).toEqual({})
  })
})
