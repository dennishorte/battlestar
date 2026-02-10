const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Wool Blankets', () => {
  test('gives 3 points for wooden house', () => {
    const card = res.getCardById('wool-blankets-a038')
    const game = t.fixture()
    t.setBoard(game, { dennis: { roomType: 'wood' } })
    game.run()

    const dennis = t.dennis(game)
    expect(card.getEndGamePoints(dennis)).toBe(3)
  })

  test('gives 2 points for clay house', () => {
    const card = res.getCardById('wool-blankets-a038')
    const game = t.fixture()
    t.setBoard(game, { dennis: { roomType: 'clay' } })
    game.run()

    const dennis = t.dennis(game)
    expect(card.getEndGamePoints(dennis)).toBe(2)
  })

  test('gives 0 points for stone house', () => {
    const card = res.getCardById('wool-blankets-a038')
    const game = t.fixture()
    t.setBoard(game, { dennis: { roomType: 'stone' } })
    game.run()

    const dennis = t.dennis(game)
    expect(card.getEndGamePoints(dennis)).toBe(0)
  })
})
