const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Flail (C026)', () => {
  test('gives 2 food on play', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        wood: 1,
        food: 0,
        hand: ['flail-c026'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'flail-c026')

    const dennis = t.player(game)
    expect(dennis.food).toBe(2)
  })

  test('has onAction for plow-field', () => {
    const card = res.getCardById('flail-c026')
    expect(card.onAction).toBeDefined()
  })
})
