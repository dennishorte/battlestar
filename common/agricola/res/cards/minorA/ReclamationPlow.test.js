const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Reclamation Plow (A017)', () => {
  test('activates on play', () => {
    const card = res.getCardById('reclamation-plow-a017')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.reclamationPlowActive).toBe(true)
  })

  test('plows field when animals are accommodated', () => {
    const card = res.getCardById('reclamation-plow-a017')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reclamationPlowActive = true

    let plowCalled = false
    game.actions.plowField = (player, opts) => {
      plowCalled = true
      expect(opts.immediate).toBe(true)
    }

    card.onTakeAnimals(game, dennis, true)

    expect(plowCalled).toBe(true)
    expect(dennis.reclamationPlowActive).toBe(false)
  })

  test('does not plow if animals not accommodated', () => {
    const card = res.getCardById('reclamation-plow-a017')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reclamationPlowActive = true

    let plowCalled = false
    game.actions.plowField = () => {
      plowCalled = true
    }

    card.onTakeAnimals(game, dennis, false)

    expect(plowCalled).toBe(false)
    expect(dennis.reclamationPlowActive).toBe(true)
  })

  test('does not plow if not active', () => {
    const card = res.getCardById('reclamation-plow-a017')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reclamationPlowActive = false

    let plowCalled = false
    game.actions.plowField = () => {
      plowCalled = true
    }

    card.onTakeAnimals(game, dennis, true)

    expect(plowCalled).toBe(false)
  })
})
