const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Newly-Plowed Field (C017)', () => {
  test('has onPlay hook that calls plowField with allowNonAdjacent', () => {
    const card = res.getCardById('newly-plowed-field-c017')
    expect(card.onPlay).toBeDefined()
  })

  test('calls plowField with allowNonAdjacent option', () => {
    const card = res.getCardById('newly-plowed-field-c017')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let plowCalled = false

    game.actions.plowField = (player, options) => {
      plowCalled = true
      expect(player).toBe(dennis)
      expect(options.allowNonAdjacent).toBe(true)
    }

    card.onPlay(game, dennis)

    expect(plowCalled).toBe(true)
  })

  test('requires exactly 3 fields as prereq', () => {
    const card = res.getCardById('newly-plowed-field-c017')
    expect(card.prereqs.fieldsExactly).toBe(3)
  })
})
