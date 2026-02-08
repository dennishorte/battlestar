const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Mole Plow (C020)', () => {
  test('has onAction hook', () => {
    const card = res.getCardById('mole-plow-c020')
    expect(card.onAction).toBeDefined()
  })

  test('plows additional field on plow-field action', () => {
    const card = res.getCardById('mole-plow-c020')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let plowCalled = false

    game.actions.plowField = (player, options) => {
      plowCalled = true
      expect(player).toBe(dennis)
      expect(options.immediate).toBe(true)
    }

    card.onAction(game, dennis, 'plow-field')

    expect(plowCalled).toBe(true)
  })

  test('plows additional field on plow-sow action', () => {
    const card = res.getCardById('mole-plow-c020')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let plowCalled = false

    game.actions.plowField = (player, options) => {
      plowCalled = true
      expect(player).toBe(dennis)
      expect(options.immediate).toBe(true)
    }

    card.onAction(game, dennis, 'plow-sow')

    expect(plowCalled).toBe(true)
  })

  test('does not trigger on other actions', () => {
    const card = res.getCardById('mole-plow-c020')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let plowCalled = false

    game.actions.plowField = () => {
      plowCalled = true
    }

    card.onAction(game, dennis, 'take-wood')

    expect(plowCalled).toBe(false)
  })
})
