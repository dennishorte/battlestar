const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Threshing Board (A024)', () => {
  test('triggers bake bread when using Farmland action', () => {
    const card = res.getCardById('threshing-board-a024')
    expect(card.onAction).toBeDefined()

    // Verify it triggers for plow-field and plow-sow
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()
    const dennis = t.player(game)

    // Create mock result tracker
    let bakeCalled = false
    const originalBakeBread = game.actions.bakeBread
    game.actions.bakeBread = () => {
      bakeCalled = true
    }

    card.onAction(game, dennis, 'plow-field')
    expect(bakeCalled).toBe(true)

    bakeCalled = false
    card.onAction(game, dennis, 'plow-sow')
    expect(bakeCalled).toBe(true)

    // Restore
    game.actions.bakeBread = originalBakeBread
  })
})
