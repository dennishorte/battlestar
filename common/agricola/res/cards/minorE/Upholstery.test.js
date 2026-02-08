const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Upholstery (E031)', () => {
  test('offers to place reed on card when playing improvement', () => {
    const card = res.getCardById('upholstery-e031')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 2
    dennis.getRoomCount = () => 3
    card.stored = 0

    let offerMade = false
    game.actions.offerUpholstery = (player, sourceCard) => {
      offerMade = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onPlayImprovement(game, dennis, { id: 'other-card' })

    expect(offerMade).toBe(true)
  })

  test('does not offer when no reed available', () => {
    const card = res.getCardById('upholstery-e031')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.getRoomCount = () => 3
    card.stored = 0

    let offerMade = false
    game.actions.offerUpholstery = () => {
      offerMade = true
    }

    card.onPlayImprovement(game, dennis, { id: 'other-card' })

    expect(offerMade).toBe(false)
  })

  test('does not offer when stored equals room count', () => {
    const card = res.getCardById('upholstery-e031')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 5
    dennis.getRoomCount = () => 3
    card.stored = 3

    let offerMade = false
    game.actions.offerUpholstery = () => {
      offerMade = true
    }

    card.onPlayImprovement(game, dennis, { id: 'other-card' })

    expect(offerMade).toBe(false)
  })

  test('does not offer when playing this card itself', () => {
    const card = res.getCardById('upholstery-e031')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 5
    dennis.getRoomCount = () => 3
    card.stored = 0

    let offerMade = false
    game.actions.offerUpholstery = () => {
      offerMade = true
    }

    card.onPlayImprovement(game, dennis, card)

    expect(offerMade).toBe(false)
  })

  test('getEndGamePoints returns stored reed count', () => {
    const card = res.getCardById('upholstery-e031')

    card.stored = 4
    expect(card.getEndGamePoints()).toBe(4)

    card.stored = 0
    expect(card.getEndGamePoints()).toBe(0)

    card.stored = undefined
    expect(card.getEndGamePoints()).toBe(0)
  })
})
