const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Boar Spear (E053)', () => {
  test('offers to convert boar to food when getting boar outside breeding', () => {
    const card = res.getCardById('boar-spear-e053')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let offerMade = false
    game.actions.offerBoarSpear = (player, sourceCard, count) => {
      offerMade = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(count).toBe(3)
    }

    card.onGetBoar(game, dennis, 3, false)

    expect(offerMade).toBe(true)
  })

  test('does not offer during breeding phase', () => {
    const card = res.getCardById('boar-spear-e053')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let offerMade = false
    game.actions.offerBoarSpear = () => {
      offerMade = true
    }

    card.onGetBoar(game, dennis, 2, true)

    expect(offerMade).toBe(false)
  })

  test('does not offer when getting 0 boar', () => {
    const card = res.getCardById('boar-spear-e053')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let offerMade = false
    game.actions.offerBoarSpear = () => {
      offerMade = true
    }

    card.onGetBoar(game, dennis, 0, false)

    expect(offerMade).toBe(false)
  })
})
