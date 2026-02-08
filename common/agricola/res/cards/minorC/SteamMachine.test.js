const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Steam Machine (C025)', () => {
  test('has onWorkPhaseEnd hook', () => {
    const card = res.getCardById('steam-machine-c025')
    expect(card.onWorkPhaseEnd).toBeDefined()
  })

  test('gives bake bread action when last action is accumulation space', () => {
    const card = res.getCardById('steam-machine-c025')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let bakeCalled = false

    game.isAccumulationSpace = () => true

    game.actions.bakeBread = (player) => {
      bakeCalled = true
      expect(player).toBe(dennis)
    }

    card.onWorkPhaseEnd(game, dennis, 'take-wood')

    expect(bakeCalled).toBe(true)
  })

  test('does not give bake bread action when last action is not accumulation space', () => {
    const card = res.getCardById('steam-machine-c025')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let bakeCalled = false

    game.isAccumulationSpace = () => false

    game.actions.bakeBread = () => {
      bakeCalled = true
    }

    card.onWorkPhaseEnd(game, dennis, 'plow-field')

    expect(bakeCalled).toBe(false)
  })
})
