const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Overhaul (C001)', () => {
  test('has onPlay hook that calls overhaulFences', () => {
    const card = res.getCardById('overhaul-c001')
    expect(card.onPlay).toBeDefined()
  })

  test('calls overhaulFences action on play', () => {
    const card = res.getCardById('overhaul-c001')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.overhaulFences = (player, cardArg) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(cardArg).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('requires 2 occupations as prereq', () => {
    const card = res.getCardById('overhaul-c001')
    expect(card.prereqs.occupations).toBe(2)
  })
})
