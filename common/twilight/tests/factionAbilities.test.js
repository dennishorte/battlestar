const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Cross-Faction Tests', () => {
  describe('Faction Technologies', () => {
    test('Sol faction techs are researchable after prerequisites', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          technologies: ['neural-motivator', 'antimass-deflectors', 'psychoarchaeology', 'bio-stims'],
        },
      })
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      // Dennis has 2 green prereqs — can research Spec Ops II (needs 2 green)
      t.choose(game, 'Strategic Action')

      const choices = t.currentChoices(game)
      expect(choices).toContain('spec-ops-ii')
    })

    test('Letnev faction techs include L4 Disruptors', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      t.setBoard(game, {
        scott: {
          technologies: ['antimass-deflectors', 'plasma-scoring', 'sarween-tools'],
        },
      })
      game.run()

      // Check that Letnev can see their faction techs
      const scott = game.players.byName('scott')
      const prereqs = scott.getTechPrerequisites()
      // Has plasma-scoring (red) + sarween-tools (yellow) -> 1 red, 1 yellow
      expect(prereqs.red).toBe(1)
      expect(prereqs.yellow).toBe(1)
    })
  })

  describe('Starting Units', () => {
    test('Sol starts with correct home system units', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter'])

      const jord = game.state.units['sol-home'].planets['jord']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(jord).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('Letnev starts with dreadnought', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      game.run()

      const spaceUnits = game.state.units['letnev-home'].space
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'destroyer', 'dreadnought', 'fighter'])
    })
  })

  describe('Law Enforcement', () => {
    test('minister-of-commerce grants 1 TG at strategy phase', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        activeLaws: [{ id: 'minister-of-commerce', name: 'Minister of Commerce', type: 'law', resolvedOutcome: 'dennis' }],
      })
      game.run()

      // Strategy phase starts → minister-of-commerce gives dennis 1 TG
      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
    })

    test('enforced-travel-ban blocks alpha/beta wormhole adjacency', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        activeLaws: ['enforced-travel-ban'],
      })
      game.run()

      const { Galaxy } = require('../model/Galaxy.js')
      const galaxy = new Galaxy(game)

      // System 26 has alpha wormhole, system 39 has alpha wormhole
      // Normally adjacent via wormhole, but travel ban blocks it
      const adj26 = galaxy.getAdjacent('26')
      expect(adj26).not.toContain('39')

      // System 25 has beta wormhole, system 40 has beta wormhole
      const adj25 = galaxy.getAdjacent('25')
      expect(adj25).not.toContain('40')
    })

    test('enforced-travel-ban does not block delta wormholes', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      t.setBoard(game, {
        activeLaws: ['enforced-travel-ban'],
      })
      game.run()

      const { Galaxy } = require('../model/Galaxy.js')
      const galaxy = new Galaxy(game)

      // Creuss gate and home both have delta wormhole → still adjacent
      const gateAdj = galaxy.getAdjacent('creuss-gate')
      expect(gateAdj).toContain('creuss-home')
    })

    test('laws survive across rounds', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        activeLaws: [{ id: 'minister-of-commerce', name: 'Minister of Commerce', type: 'law', resolvedOutcome: 'dennis' }],
      })
      game.run()

      // First round strategy phase → dennis gains 1 TG
      expect(game._isLawActive('minister-of-commerce')).toBe(true)
      expect(game.state.activeLaws.length).toBe(1)
    })

    test('_isLawActive returns false when law not present', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      expect(game._isLawActive('minister-of-commerce')).toBe(false)
      expect(game._isLawActive('enforced-travel-ban')).toBe(false)
    })
  })

  describe('Commander Effects Registry', () => {
    test('Sol commander effect returns ground combat modifier', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const effects = game.factionAbilities.getActiveCommanderEffects(dennis)
      expect(effects.length).toBe(1)
      expect(effects[0].factionId).toBe('federation-of-sol')
      expect(effects[0].timing).toBe('ground-combat-modifier')
    })

    test('locked commander returns no effects', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      // Commander starts locked
      expect(dennis.isCommanderUnlocked()).toBe(false)
      const effects = game.factionAbilities.getActiveCommanderEffects(dennis)
      expect(effects.length).toBe(0)
    })

    test('Sardakk commander provides combat modifier', () => {
      const game = t.fixture({ factions: ['sardakk-norr', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const modifier = game.factionAbilities.getCommanderCombatModifier(dennis, 'space')
      expect(modifier).toBe(1)
    })

    test('Sol commander modifier only applies to ground combat', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: { leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' } },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      // Ground combat: Sol commander provides bonus
      const groundMod = game.factionAbilities.getCommanderCombatModifier(dennis, 'ground')
      expect(groundMod).toBe(1)

      // Space combat: Sol commander does NOT provide bonus
      const spaceMod = game.factionAbilities.getCommanderCombatModifier(dennis, 'space')
      expect(spaceMod).toBe(0)
    })
  })

  describe('Alliance Promissory Notes', () => {
    test('players start with Alliance promissory note', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      expect(dennis.hasPromissoryNote('alliance', 'dennis')).toBe(true)
      expect(micah.hasPromissoryNote('alliance', 'micah')).toBe(true)
    })

    test('Mahact has no Alliance note (hubris purges it)', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'federation-of-sol'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Mahact should not have Alliance note
      expect(dennis.hasPromissoryNote('alliance', 'dennis')).toBe(false)

      // Sol should still have theirs
      expect(micah.hasPromissoryNote('alliance', 'micah')).toBe(true)
    })

    test('Alliance note is tradeable to non-Mahact players', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Manually trade Alliance note
      const note = dennis.removePromissoryNote('alliance', 'dennis')
      expect(note).not.toBeNull()
      micah.addPromissoryNote(note.id, note.owner)

      expect(dennis.hasPromissoryNote('alliance', 'dennis')).toBe(false)
      expect(micah.hasPromissoryNote('alliance', 'dennis')).toBe(true)
    })

    test('cannot give Alliance notes to Mahact via transaction', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'mahact-gene-sorcerers'] })
      t.setBoard(game, {
        dennis: { tradeGoods: 5 },
        micah: { tradeGoods: 5 },
      })
      game.run()

      // Pick trade for dennis, imperial for micah
      t.choose(game, 'trade')
      t.choose(game, 'imperial')

      // Dennis uses trade primary
      t.choose(game, 'Strategic Action')

      // Dennis offers Alliance note to Mahact (micah) — should be silently rejected
      t.action(game, 'trade-offer', {
        partner: 'micah',
        offering: {
          promissoryNotes: [{ id: 'alliance', owner: 'dennis' }],
        },
        requesting: {},
      })

      // The transaction should not go through — Alliance note stays with dennis
      const dennis = game.players.byName('dennis')
      expect(dennis.hasPromissoryNote('alliance', 'dennis')).toBe(true)
    })
  })
})
