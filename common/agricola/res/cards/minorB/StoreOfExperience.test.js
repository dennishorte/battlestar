const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Store of Experience (B005)', () => {
  test('gives stone with 0-3 occupations in hand', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        hand: ['store-of-experience-b005'],
      },
    })
    game.run()

    // Set up player with 2 occupations in hand (default)
    const dennis = t.player(game)
    dennis.getOccupationsInHand = () => [{ id: 'occ1' }, { id: 'occ2' }]
    dennis.stone = 0

    const card = res.getCardById('store-of-experience-b005')
    card.onPlay(game, dennis)

    expect(dennis.stone).toBe(1)
  })

  test('gives wood with 6+ occupations in hand', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationsInHand = () => [1, 2, 3, 4, 5, 6, 7].map(i => ({ id: `occ${i}` }))
    dennis.wood = 0

    const card = res.getCardById('store-of-experience-b005')
    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })
})
