const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Slurry (C071)', () => {
  test('has onBreedingPhaseEnd hook', () => {
    const card = res.getCardById('slurry-c071')
    expect(card.onBreedingPhaseEnd).toBeDefined()
  })

  test('gives sow action when 2 or more newborn types', () => {
    const card = res.getCardById('slurry-c071')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let sowCalled = false

    game.actions.sow = (_player) => {
      sowCalled = true
      expect(_player).toBe(dennis)
    }

    card.onBreedingPhaseEnd(game, dennis, 2)

    expect(sowCalled).toBe(true)
  })

  test('gives sow action when 3 newborn types', () => {
    const card = res.getCardById('slurry-c071')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let sowCalled = false

    game.actions.sow = (_player) => {
      sowCalled = true
    }

    card.onBreedingPhaseEnd(game, dennis, 3)

    expect(sowCalled).toBe(true)
  })

  test('does not give sow action when 1 newborn type', () => {
    const card = res.getCardById('slurry-c071')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let sowCalled = false

    game.actions.sow = () => {
      sowCalled = true
    }

    card.onBreedingPhaseEnd(game, dennis, 1)

    expect(sowCalled).toBe(false)
  })

  test('does not give sow action when 0 newborn types', () => {
    const card = res.getCardById('slurry-c071')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let sowCalled = false

    game.actions.sow = () => {
      sowCalled = true
    }

    card.onBreedingPhaseEnd(game, dennis, 0)

    expect(sowCalled).toBe(false)
  })
})
