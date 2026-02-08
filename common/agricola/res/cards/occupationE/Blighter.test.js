const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Blighter (E101)', () => {
  test('gives bonus points based on complete stages left', () => {
    const card = res.getCardById('blighter-e101')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.getCompleteStagesLeft = () => 4

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    card.onPlay(game, dennis)

    expect(dennis.bonusPoints).toBe(4)
    expect(dennis.cannotPlayOccupations).toBe(true)
  })

  test('prevents player from playing more occupations', () => {
    const card = res.getCardById('blighter-e101')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.getCompleteStagesLeft = () => 2

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.cannotPlayOccupations).toBe(true)
  })
})
