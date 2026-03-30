const t = require('../testutil')
const factions = require('../systems/factions')

describe('Faction Bonus Permanence', () => {

  test('bonus at 4 influence is kept when dropping below 4', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { guild: 4 }, solari: 3 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    // Guild bonus at 4 is +3 Solari — already applied during setup climb
    // Now lose influence below 4
    factions.loseInfluence(game, dennis, 'guild', 1)
    expect(dennis.getInfluence('guild')).toBe(3)

    // Solari should NOT be taken back — bonus is permanent
    expect(dennis.solari).toBe(3)
  })

  test('bonus can be re-earned by moving back up to 4', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { influence: { fremen: 3 }, water: 1 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const waterBefore = dennis.water

    // Gain to 4: fremen bonus is +1 Water
    factions.gainInfluence(game, dennis, 'fremen', 1)
    expect(dennis.getInfluence('fremen')).toBe(4)
    expect(dennis.water).toBe(waterBefore + 1)

    // Drop below 4
    factions.loseInfluence(game, dennis, 'fremen', 1)
    expect(dennis.getInfluence('fremen')).toBe(3)

    // Climb back to 4: should earn bonus again
    const waterBeforeSecond = dennis.water
    factions.gainInfluence(game, dennis, 'fremen', 1)
    expect(dennis.getInfluence('fremen')).toBe(4)
    expect(dennis.water).toBe(waterBeforeSecond + 1)
  })
})
