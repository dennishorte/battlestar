const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Basket Chair (C022)', () => {
  test('has onPlay hook that calls basketChairEffect', () => {
    const card = res.getCardById('basket-chair-c022')
    expect(card.onPlay).toBeDefined()
  })

  test('calls basketChairEffect action on play', () => {
    const card = res.getCardById('basket-chair-c022')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.basketChairEffect = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
