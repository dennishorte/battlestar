const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Basketmaker's Wife (C139)", () => {
  test('gives 1 reed and 1 food on play', () => {
    const card = res.getCardById('basketmakers-wife-c139')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.food = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.reed).toBe(1)
    expect(dennis.food).toBe(1)
  })

  test('has anytime conversion from reed to food', () => {
    const card = res.getCardById('basketmakers-wife-c139')

    expect(card.allowsAnytimeConversion).toEqual({
      from: { reed: 1 },
      to: { food: 2 },
    })
  })
})
