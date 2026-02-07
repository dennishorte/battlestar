const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Small Potter's Oven (C060)", () => {
  test('gives 5 food on play', () => {
    const card = res.getCardById('small-potters-oven-c060')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(5)
  })

  test('has 5 VPs and isOven', () => {
    const card = res.getCardById('small-potters-oven-c060')
    expect(card.vps).toBe(5)
    expect(card.isOven).toBe(true)
  })
})
