const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sleight of Hand (E078)', () => {
  test('calls sleightOfHand action on play', () => {
    const card = res.getCardById('sleight-of-hand-e078')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let actionCalled = false
    game.actions.sleightOfHand = (player, sourceCard) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onPlay(game, dennis)

    expect(actionCalled).toBe(true)
  })

  test('requires 3 occupations as prereq', () => {
    const card = res.getCardById('sleight-of-hand-e078')
    expect(card.prereqs.occupations).toBe(3)
  })
})
