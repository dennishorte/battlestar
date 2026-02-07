const t = require('../../../testutil.js')

describe('Excursion to the Quarry (B006)', () => {
  test('gives stone equal to family members', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        food: 2,
        stone: 0,
        hand: ['excursion-to-the-quarry-b006'],
        occupations: ['wood-cutter'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'excursion-to-the-quarry-b006')

    const dennis = t.player(game)
    // 2 family members by default
    expect(dennis.stone).toBe(2)
  })
})
