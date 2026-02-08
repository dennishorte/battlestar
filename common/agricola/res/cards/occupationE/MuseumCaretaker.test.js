const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Museum Caretaker (E100)', () => {
  test('gives bonus point when player has all resource types', () => {
    const card = res.getCardById('museum-caretaker-e100')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.clay = 1
    dennis.reed = 1
    dennis.stone = 1
    dennis.grain = 1
    dennis.vegetables = 1
    dennis.bonusPoints = 0

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.bonusPoints).toBe(1)
  })

  test('does not give bonus point when missing wood', () => {
    const card = res.getCardById('museum-caretaker-e100')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.clay = 1
    dennis.reed = 1
    dennis.stone = 1
    dennis.grain = 1
    dennis.vegetables = 1
    dennis.bonusPoints = 0

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.bonusPoints).toBe(0)
  })

  test('does not give bonus point when missing vegetables', () => {
    const card = res.getCardById('museum-caretaker-e100')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.clay = 1
    dennis.reed = 1
    dennis.stone = 1
    dennis.grain = 1
    dennis.vegetables = 0
    dennis.bonusPoints = 0

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.bonusPoints).toBe(0)
  })
})
