const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Writing Boards (C004)', () => {
  test('gives wood equal to occupations played', () => {
    const card = res.getCardById('writing-boards-c004')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.occupationsPlayed = 3
    dennis.food = 1
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(3)
  })
})
