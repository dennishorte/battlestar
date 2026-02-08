const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Blade Shears (C007)', () => {
  test('has onPlay hook that calls bladeShearsChoice', () => {
    const card = res.getCardById('blade-shears-c007')
    expect(card.onPlay).toBeDefined()
  })

  test('calls bladeShearsChoice action on play', () => {
    const card = res.getCardById('blade-shears-c007')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.bladeShearsChoice = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
