const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Paintbrush (E039)', () => {
  test('offers exchange during harvest when player has clay', () => {
    const card = res.getCardById('paintbrush-e039')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 3

    let offerMade = false
    game.actions.offerPaintbrush = (player, sourceCard) => {
      offerMade = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onHarvest(game, dennis)

    expect(offerMade).toBe(true)
  })

  test('does not offer when player has no clay', () => {
    const card = res.getCardById('paintbrush-e039')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    let offerMade = false
    game.actions.offerPaintbrush = () => {
      offerMade = true
    }

    card.onHarvest(game, dennis)

    expect(offerMade).toBe(false)
  })

  test('requires 1 boar as prereq', () => {
    const card = res.getCardById('paintbrush-e039')
    expect(card.prereqs.boar).toBe(1)
  })
})
