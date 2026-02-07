const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Iron Oven (E063)', () => {
  test('has baking rate of 6', () => {
    const card = res.getCardById('iron-oven-e063')
    expect(card.bakingRate).toBe(6)
    expect(card.maxBakePerAction).toBe(1)
    expect(card.vps).toBe(2)
  })

  test('offers bake bread action on play', () => {
    const card = res.getCardById('iron-oven-e063')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let bakeBreadOffered = false
    game.actions.offerBakeBread = (player, sourceCard) => {
      bakeBreadOffered = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(bakeBreadOffered).toBe(true)
  })
})
