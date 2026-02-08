const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stone Axe (E075)', () => {
  test('offers extra wood for stone on forest action', () => {
    const card = res.getCardById('stone-axe-e075')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 2

    let offerMade = false
    game.actions.offerStoneAxe = (player, sourceCard) => {
      offerMade = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onAction(game, dennis, 'forest')

    expect(offerMade).toBe(true)
  })

  test('offers on grove action', () => {
    const card = res.getCardById('stone-axe-e075')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 1

    let offerMade = false
    game.actions.offerStoneAxe = () => {
      offerMade = true
    }

    card.onAction(game, dennis, 'grove')

    expect(offerMade).toBe(true)
  })

  test('offers on copse action', () => {
    const card = res.getCardById('stone-axe-e075')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 1

    let offerMade = false
    game.actions.offerStoneAxe = () => {
      offerMade = true
    }

    card.onAction(game, dennis, 'copse')

    expect(offerMade).toBe(true)
  })

  test('does not offer when player has no stone', () => {
    const card = res.getCardById('stone-axe-e075')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0

    let offerMade = false
    game.actions.offerStoneAxe = () => {
      offerMade = true
    }

    card.onAction(game, dennis, 'forest')

    expect(offerMade).toBe(false)
  })

  test('does not offer for non-wood actions', () => {
    const card = res.getCardById('stone-axe-e075')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 5

    let offerMade = false
    game.actions.offerStoneAxe = () => {
      offerMade = true
    }

    card.onAction(game, dennis, 'clay-pit')

    expect(offerMade).toBe(false)
  })
})
