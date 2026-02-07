const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mantlepiece (B033)', () => {
  test('gives bonus points based on rounds left', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        stone: 1,
        roomType: 'clay',
        hand: ['mantlepiece-b033'],
      },
      round: 10,
    })
    game.run()

    game.state.round = 10
    t.playCard(game, 'dennis', 'mantlepiece-b033')

    const dennis = t.player(game)
    // 14 - 10 = 4 rounds left
    expect(dennis.bonusPoints).toBe(4)
    expect(dennis.cannotRenovate).toBe(true)
  })

  test('has -3 VPs', () => {
    const card = res.getCardById('mantlepiece-b033')
    expect(card.vps).toBe(-3)
  })
})
