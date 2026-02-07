const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Hauberg (B041)', () => {
  test('calls offerHauberg on play', () => {
    const card = res.getCardById('hauberg-b041')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerHauberg = jest.fn()

    card.onPlay(game, dennis)

    expect(game.actions.offerHauberg).toHaveBeenCalledWith(dennis, card)
  })

  test('requires 3 occupations', () => {
    const card = res.getCardById('hauberg-b041')
    expect(card.prereqs.occupations).toBe(3)
  })

  test('costs 3 food', () => {
    const card = res.getCardById('hauberg-b041')
    expect(card.cost).toEqual({ food: 3 })
  })
})
