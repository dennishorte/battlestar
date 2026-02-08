const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Beaver Colony (E033)', () => {
  test('disables a pasture with stable', () => {
    const card = res.getCardById('beaver-colony-e033')
    expect(card.disablesPastureWithStable).toBe(true)
  })

  test('gives 1 bonus point when getting reed from action space', () => {
    const card = res.getCardById('beaver-colony-e033')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    game.actionGivesReed = () => true

    card.onAction(game, dennis, 'reed-bank')

    expect(dennis.bonusPoints).toBe(1)
  })

  test('does not give bonus point for non-reed actions', () => {
    const card = res.getCardById('beaver-colony-e033')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    game.actionGivesReed = () => false

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.bonusPoints).toBe(0)
  })
})
