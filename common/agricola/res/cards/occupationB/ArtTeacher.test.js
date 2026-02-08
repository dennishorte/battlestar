const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Art Teacher (B155)', () => {
  test('gives 1 wood and 1 reed on play', () => {
    const card = res.getCardById('art-teacher-b155')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.reed = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
    expect(dennis.reed).toBe(1)
  })

  test('has canUseTravelingPlayersFood flag', () => {
    const card = res.getCardById('art-teacher-b155')
    expect(card.canUseTravelingPlayersFood).toBe(true)
  })
})
