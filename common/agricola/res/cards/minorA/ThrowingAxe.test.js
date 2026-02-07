const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Throwing Axe (A052)', () => {
  test('gives 2 food on wood action when pig market has boar', () => {
    const card = res.getCardById('throwing-axe-a052')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.actionSpaces = { 'take-boar': { accumulated: 2 } }

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(2)
  })

  test('does not give food when pig market is empty', () => {
    const card = res.getCardById('throwing-axe-a052')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.actionSpaces = { 'take-boar': { accumulated: 0 } }

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(0)
  })

  test('does not trigger on non-wood actions', () => {
    const card = res.getCardById('throwing-axe-a052')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.state.actionSpaces = { 'take-boar': { accumulated: 2 } }

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.food).toBe(0)
  })
})
