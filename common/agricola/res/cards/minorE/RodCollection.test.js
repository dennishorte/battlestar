const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Rod Collection (E038)', () => {
  test('offers to place wood on card when fishing', () => {
    const card = res.getCardById('rod-collection-e038')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let offerMade = false
    game.actions.offerRodCollection = (player, sourceCard) => {
      offerMade = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onAction(game, dennis, 'fishing')

    expect(offerMade).toBe(true)
  })

  test('does not offer for other actions', () => {
    const card = res.getCardById('rod-collection-e038')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let offerMade = false
    game.actions.offerRodCollection = () => {
      offerMade = true
    }

    card.onAction(game, dennis, 'day-laborer')

    expect(offerMade).toBe(false)
  })

  test('getEndGamePoints excludes 1st, 4th, 7th, and 10th wood', () => {
    const card = res.getCardById('rod-collection-e038')

    // 0 wood = 0 points
    card.stored = 0
    expect(card.getEndGamePoints()).toBe(0)

    // 1 wood = 0 points (1st excluded)
    card.stored = 1
    expect(card.getEndGamePoints()).toBe(0)

    // 2 wood = 1 point (2nd counts)
    card.stored = 2
    expect(card.getEndGamePoints()).toBe(1)

    // 3 wood = 2 points (2nd, 3rd count)
    card.stored = 3
    expect(card.getEndGamePoints()).toBe(2)

    // 4 wood = 2 points (4th excluded)
    card.stored = 4
    expect(card.getEndGamePoints()).toBe(2)

    // 5 wood = 3 points
    card.stored = 5
    expect(card.getEndGamePoints()).toBe(3)

    // 7 wood = 4 points (7th excluded)
    card.stored = 7
    expect(card.getEndGamePoints()).toBe(4)

    // 10 wood = 6 points (10th excluded)
    card.stored = 10
    expect(card.getEndGamePoints()).toBe(6)
  })
})
