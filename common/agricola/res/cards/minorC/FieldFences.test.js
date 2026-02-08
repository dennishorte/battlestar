const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Field Fences (C016)', () => {
  test('has onPlay hook that calls fieldFencesAction', () => {
    const card = res.getCardById('field-fences-c016')
    expect(card.onPlay).toBeDefined()
  })

  test('calls fieldFencesAction on play', () => {
    const card = res.getCardById('field-fences-c016')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.fieldFencesAction = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })
})
