const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Embers of Muaat', () => {
  describe('Star Forge', () => {
    test('spends strategy token to place fighters in war sun system', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action → Star Forge
      t.choose(game, 'Component Action')
      t.choose(game, 'star-forge')

      // Choose 2 Fighters
      t.choose(game, '2 Fighters')

      // War sun is in muaat-home, auto-selects system
      const spaceUnits = game.state.units['muaat-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      // Started with war-sun + 2 fighters, now + 2 fighters = war-sun + 4 fighters
      expect(spaceUnits).toEqual(['fighter', 'fighter', 'fighter', 'fighter', 'war-sun'])

      // Should have spent 1 strategy token
      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.strategy).toBe(1)
    })

    test('can place 1 destroyer instead of fighters', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action')
      t.choose(game, 'star-forge')
      t.choose(game, '1 Destroyer')

      const spaceUnits = game.state.units['muaat-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['destroyer', 'fighter', 'fighter', 'war-sun'])
    })
  })

  describe('Gashlai Physiology', () => {
    test('ships can move through supernova systems', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()

      // Test the canMoveThroughSupernovae method directly
      expect(game.factionAbilities.canMoveThroughSupernovae('dennis')).toBe(true)
      expect(game.factionAbilities.canMoveThroughSupernovae('micah')).toBe(false)
    })
  })
})
