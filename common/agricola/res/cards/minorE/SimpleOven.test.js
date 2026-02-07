const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Simple Oven (E064)', () => {
  test('has baking rate of 3', () => {
    const card = res.getCardById('simple-oven-e064')
    expect(card.bakingRate).toBe(3)
    expect(card.maxBakePerAction).toBe(1)
    expect(card.vps).toBe(1)
  })

  test('offers bake bread action on play', () => {
    const card = res.getCardById('simple-oven-e064')
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
