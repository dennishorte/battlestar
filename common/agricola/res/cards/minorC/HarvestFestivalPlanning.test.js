const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Harvest Festival Planning (C072)', () => {
  test('has onPlay hook', () => {
    const card = res.getCardById('harvest-festival-planning-c072')
    expect(card.onPlay).toBeDefined()
  })

  test('calls harvestFieldPhase and majorOrMinorImprovement actions', () => {
    const card = res.getCardById('harvest-festival-planning-c072')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let harvestCalled = false
    let improvementCalled = false

    game.actions.harvestFieldPhase = (player) => {
      harvestCalled = true
      expect(player).toBe(dennis)
    }

    game.actions.majorOrMinorImprovement = (player) => {
      improvementCalled = true
      expect(player).toBe(dennis)
    }

    card.onPlay(game, dennis)

    expect(harvestCalled).toBe(true)
    expect(improvementCalled).toBe(true)
  })
})
