const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Growing Farm (B052)', () => {
  test('gives food equal to current round', () => {
    const card = res.getCardById('growing-farm-b052')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.round = 7

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(7)
  })

  test('gives food in early rounds', () => {
    const card = res.getCardById('growing-farm-b052')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.round = 2

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(2)
  })

  test('has 2 VPs', () => {
    const card = res.getCardById('growing-farm-b052')
    expect(card.vps).toBe(2)
  })

  test('requires pasture spaces >= round', () => {
    const card = res.getCardById('growing-farm-b052')
    expect(card.prereqs.pastureSpacesGteRound).toBe(true)
  })

  test('costs clay and reed', () => {
    const card = res.getCardById('growing-farm-b052')
    expect(card.cost).toEqual({ clay: 2, reed: 1 })
  })
})
