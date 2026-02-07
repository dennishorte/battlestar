const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bread Paddle (B025)', () => {
  test('gives 1 food on play', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        wood: 1,
        food: 0,
        hand: ['bread-paddle-b025'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'bread-paddle-b025')

    const dennis = t.player(game)
    expect(dennis.food).toBe(1)
  })

  test('has onPlayOccupation hook', () => {
    const card = res.getCardById('bread-paddle-b025')
    expect(card.onPlayOccupation).toBeDefined()
  })
})
