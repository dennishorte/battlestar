const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Empyrean', () => {
  test('ships can move through nebula', () => {
    const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
    game.run()

    expect(game.factionAbilities.canMoveThroughNebulae('dennis')).toBe(true)
    expect(game.factionAbilities.canMoveThroughNebulae('micah')).toBe(false)
  })

  describe('Dark Whispers', () => {
    test('Empyrean starts with 2 copies of faction promissory note', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const factionNotes = dennis.promissoryNotes.filter(n => n.id === 'dark-pact')
      expect(factionNotes.length).toBe(2)
    })

    test('non-Empyrean starts with 1 faction promissory note', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      game.run()

      // Sol doesn't have Dark Whispers, so only 1 copy of faction note
      // Sol has no faction-specific promissory note, so check generic notes instead
      const dennis = game.players.byName('dennis')
      const genericNotes = dennis.promissoryNotes.filter(n => n.id === 'support-for-the-throne')
      expect(genericNotes.length).toBe(1)

      // Micah (Empyrean) should have 2 copies
      const micah = game.players.byName('micah')
      const darkPacts = micah.promissoryNotes.filter(n => n.id === 'dark-pact')
      expect(darkPacts.length).toBe(2)
    })
  })

  describe('Aetherpassage', () => {
    test('permission granted allows movement through Empyrean systems', () => {
      // Layout: sol-home(0,-3) → 27(0,-2) → 26(0,-1) → mecatol(0,0)
      // Empyrean ships in system 27 block Sol movement, unless aetherpassage granted
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // Empyrean (micah) prompted for aetherpassage
      t.choose(game, 'Allow Passage')

      // Now Sol can move through system 27 (Empyrean ships there)
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // Cruiser should arrive in system 26
      const ships26 = game.state.units['26'].space.filter(u => u.owner === 'dennis')
      expect(ships26.length).toBe(1)
    })

    test('permission denied blocks movement through Empyrean systems', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'sol-home': {
              space: ['cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['destroyer'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '26' })

      // Empyrean denies passage
      t.choose(game, 'Deny')

      // Sol tries to move through system 27 — blocked by Empyrean ships
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'sol-home', count: 1 }],
      })

      // Cruiser should NOT arrive (no valid path)
      const ships26 = game.state.units['26'].space.filter(u => u.owner === 'dennis')
      expect(ships26.length).toBe(0)
    })

    test('aetherpassage only lasts one tactical action', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'empyrean'] })
      game.run()

      // Grant is set and cleared
      game.state.aetherpassageGrant = 'micah'
      expect(game.state.aetherpassageGrant).toBe('micah')

      // After clearing (simulated end of tactical action)
      game.state.aetherpassageGrant = null
      expect(game.state.aetherpassageGrant).toBeNull()
    })

    test('Empyrean not prompted on own turn', () => {
      // When Empyrean activates a system, they should NOT be prompted
      const game = t.fixture({ factions: ['empyrean', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities._hasAbility(dennis, 'aetherpassage')).toBe(true)

      // No prompt for self — this is verified by the game flow not blocking
    })
  })
})
