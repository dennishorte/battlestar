const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Final Scenario (B023)', () => {
  test('sets finalScenarioActive flag on play', () => {
    const card = res.getCardById('final-scenario-b023')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.finalScenarioActive = false

    card.onPlay(game, dennis)

    expect(dennis.finalScenarioActive).toBe(true)
  })

  test('requires max round 13', () => {
    const card = res.getCardById('final-scenario-b023')
    expect(card.prereqs.maxRound).toBe(13)
  })

  test('has no cost', () => {
    const card = res.getCardById('final-scenario-b023')
    expect(card.cost).toEqual({})
  })
})
