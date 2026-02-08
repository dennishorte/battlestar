const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bonehead (OccD 118)', () => {
  test('places 6 wood on card and gives 1 wood immediately on play', () => {
    const card = res.getCardById('bonehead-d118')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(card.wood).toBe(5) // Started at 6, took 1
    expect(dennis.wood).toBe(1)
  })

  test('gives 1 wood when playing another card', () => {
    const card = res.getCardById('bonehead-d118')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    card.wood = 4

    card.onPlayCard(game, dennis)

    expect(card.wood).toBe(3)
    expect(dennis.wood).toBe(1)
  })

  test('does not give wood when pile is empty', () => {
    const card = res.getCardById('bonehead-d118')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    card.wood = 0

    card.onPlayCard(game, dennis)

    expect(card.wood).toBe(0)
    expect(dennis.wood).toBe(0)
  })

  test('handles undefined wood counter', () => {
    const card = res.getCardById('bonehead-d118')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    card.wood = undefined

    card.onPlayCard(game, dennis)

    expect(dennis.wood).toBe(0)
  })
})
