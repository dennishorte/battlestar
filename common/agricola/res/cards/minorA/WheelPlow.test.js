const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wheel Plow (A018)', () => {
  test('plows 2 additional fields on first worker plow action', () => {
    const card = res.getCardById('wheel-plow-a018')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wheelPlowUsed = false
    dennis.isFirstWorkerThisRound = () => true

    let plowCount = 0
    game.actions.plowField = (player, opts) => {
      plowCount++
      expect(opts.immediate).toBe(true)
    }

    card.onAction(game, dennis, 'plow-field')

    expect(plowCount).toBe(2)
    expect(dennis.wheelPlowUsed).toBe(true)
  })

  test('does not trigger on non-first worker', () => {
    const card = res.getCardById('wheel-plow-a018')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wheelPlowUsed = false
    dennis.isFirstWorkerThisRound = () => false

    let plowCount = 0
    game.actions.plowField = () => {
      plowCount++
    }

    card.onAction(game, dennis, 'plow-field')

    expect(plowCount).toBe(0)
    expect(dennis.wheelPlowUsed).toBe(false)
  })

  test('only triggers once', () => {
    const card = res.getCardById('wheel-plow-a018')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wheelPlowUsed = true
    dennis.isFirstWorkerThisRound = () => true

    let plowCount = 0
    game.actions.plowField = () => {
      plowCount++
    }

    card.onAction(game, dennis, 'plow-field')

    expect(plowCount).toBe(0)
  })

  test('triggers on plow-sow action too', () => {
    const card = res.getCardById('wheel-plow-a018')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wheelPlowUsed = false
    dennis.isFirstWorkerThisRound = () => true

    let plowCount = 0
    game.actions.plowField = () => {
      plowCount++
    }

    card.onAction(game, dennis, 'plow-sow')

    expect(plowCount).toBe(2)
  })
})
