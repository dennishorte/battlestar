const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Ox Skull (E037)', () => {
  test('gives 1 food on play', () => {
    const card = res.getCardById('ox-skull-e037')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(1)
  })

  test('gives 3 bonus points if no cattle at end', () => {
    const card = res.getCardById('ox-skull-e037')

    const noCattle = { getAnimalCount: () => 0 }
    expect(card.getEndGamePoints(noCattle)).toBe(3)

    const hasCattle = { getAnimalCount: () => 2 }
    expect(card.getEndGamePoints(hasCattle)).toBe(0)
  })
})
