const t = require('../testutil.js')
const res = require('../res/index.js')
const { Galaxy } = require('../model/Galaxy.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

function findAdjacent(systemId) {
  const temp = t.fixture()
  temp.run()
  const galaxy = new Galaxy(temp)
  return galaxy.getAdjacent(systemId)[0]
}

describe('Promissory Notes', () => {
  describe('Data', () => {
    test('generic promissory notes exist', () => {
      const notes = res.getGenericPromissoryNotes()
      expect(notes.length).toBe(4)
      expect(notes.map(n => n.id)).toContain('support-for-the-throne')
      expect(notes.map(n => n.id)).toContain('ceasefire')
      expect(notes.map(n => n.id)).toContain('trade-agreement')
      expect(notes.map(n => n.id)).toContain('political-secret')
    })

    test('each faction has a promissory note', () => {
      const factions = res.getAllFactions()
      for (const faction of factions) {
        expect(faction.promissoryNote).toBeTruthy()
        expect(faction.promissoryNote.id).toBeTruthy()
        expect(faction.promissoryNote.name).toBeTruthy()
      }
    })
  })

  describe('Initialization', () => {
    test('players start with 4 generic + 1 faction + 1 alliance promissory note', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.promissoryNotes.length).toBe(6)

      // Check generic notes
      expect(dennis.hasPromissoryNote('support-for-the-throne')).toBe(true)
      expect(dennis.hasPromissoryNote('ceasefire')).toBe(true)
      expect(dennis.hasPromissoryNote('trade-agreement')).toBe(true)
      expect(dennis.hasPromissoryNote('political-secret')).toBe(true)

      // Check faction note (Sol = military-support)
      expect(dennis.hasPromissoryNote('military-support')).toBe(true)

      // Check alliance note
      expect(dennis.hasPromissoryNote('alliance')).toBe(true)
    })

    test('promissory notes are owned by the player', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      for (const note of dennis.promissoryNotes) {
        expect(note.owner).toBe('dennis')
      }
    })

    test('setBoard can override promissory notes', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [
            { id: 'support-for-the-throne', owner: 'micah' },
          ],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.promissoryNotes.length).toBe(1)
      expect(dennis.promissoryNotes[0].id).toBe('support-for-the-throne')
      expect(dennis.promissoryNotes[0].owner).toBe('micah')
    })
  })

  describe('Trading', () => {
    test('promissory note can be traded in a transaction', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 3,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          commodities: 2,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Pass')  // micah declines secondary

      // Dennis offers 1 TG + support for the throne, requests 2 commodities
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: {
          tradeGoods: 1,
          promissoryNotes: [{ id: 'support-for-the-throne', owner: 'dennis' }],
        },
        requesting: { commodities: 2 },
      })
      t.choose(game, 'Accept')

      // Dennis should have lost the note
      const dennis = game.players.byName('dennis')
      expect(dennis.hasPromissoryNote('support-for-the-throne', 'dennis')).toBe(false)
      expect(dennis.tradeGoods).toBe(4)  // 3 - 1 + 2 (commodities → TG)

      // Micah should have the note
      const micah = game.players.byName('micah')
      expect(micah.hasPromissoryNote('support-for-the-throne', 'dennis')).toBe(true)
      expect(micah.tradeGoods).toBe(1)   // received 1 TG
      expect(micah.commodities).toBe(0)  // 2 - 2
    })

    test('promissory note retains original owner after trade', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          tradeGoods: 1,
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          tradeGoods: 1,
          units: {
            [target]: { space: ['cruiser'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Pass')

      // Dennis offers political-secret note to micah (won't auto-trigger like ceasefire)
      t.choose(game, 'micah')
      t.action(game, 'trade-offer', {
        offering: {
          promissoryNotes: [{ id: 'political-secret', owner: 'dennis' }],
        },
        requesting: {},
      })
      t.choose(game, 'Accept')

      const micah = game.players.byName('micah')
      const note = micah.promissoryNotes.find(
        n => n.id === 'political-secret' && n.owner === 'dennis'
      )
      expect(note).toBeTruthy()
      expect(note.owner).toBe('dennis')  // still dennis's note
    })
  })

  describe('Player Methods', () => {
    test('hasPromissoryNote checks by id and optionally owner', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasPromissoryNote('ceasefire')).toBe(true)
      expect(dennis.hasPromissoryNote('ceasefire', 'dennis')).toBe(true)
      expect(dennis.hasPromissoryNote('ceasefire', 'micah')).toBe(false)
    })

    test('removePromissoryNote returns the removed note', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const note = dennis.removePromissoryNote('ceasefire', 'dennis')
      expect(note).toBeTruthy()
      expect(note.id).toBe('ceasefire')
      expect(note.owner).toBe('dennis')
      expect(dennis.hasPromissoryNote('ceasefire')).toBe(false)
    })

    test('removePromissoryNote returns null if not found', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      const note = dennis.removePromissoryNote('nonexistent', 'dennis')
      expect(note).toBeNull()
    })
  })

  // ---------------------------------------------------------------------------
  // Support for the Throne (Rule 69)
  // ---------------------------------------------------------------------------

  describe('Support for the Throne', () => {
    test('SFT gives +1 VP to holder', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [
            { id: 'support-for-the-throne', owner: 'micah' },
          ],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      // Dennis holds micah's SFT → +1 VP
      expect(dennis.getVictoryPoints()).toBe(1)
    })

    test('SFT from own player does not give VP', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [
            { id: 'support-for-the-throne', owner: 'dennis' },
          ],
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getVictoryPoints()).toBe(0)
    })

    test('SFT returned when activating system with giver units', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [
            { id: 'support-for-the-throne', owner: 'micah' },
          ],
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          units: {
            [target]: { space: ['fighter'], 'bereg': ['infantry'] },
            'hacan-home': { 'arretze': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates target system which has micah's units
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })

      // SFT should have been returned to micah
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.hasPromissoryNote('support-for-the-throne', 'micah')).toBe(false)
      expect(micah.hasPromissoryNote('support-for-the-throne', 'micah')).toBe(true)
    })

    test('SFT not returned when activating system without giver units', () => {
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [
            { id: 'support-for-the-throne', owner: 'micah' },
          ],
          units: {
            'sol-home': { space: ['cruiser'] },
          },
        },
        micah: {
          units: {
            'hacan-home': { 'arretze': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates an empty system (no micah units)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })

      // SFT should NOT be returned
      const dennis = game.players.byName('dennis')
      expect(dennis.hasPromissoryNote('support-for-the-throne', 'micah')).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // Trade Agreement (Rule 69)
  // ---------------------------------------------------------------------------

  describe('Trade Agreement', () => {
    test('when owner replenishes commodities, gives all commodities to holder', () => {
      // Dennis holds Micah's trade agreement. Micah (Hacan) replenishes via Trade primary.
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          promissoryNotes: [
            { id: 'trade-agreement', owner: 'micah' },
          ],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'trade')

      // Dennis goes first — plays Leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Pass')  // Micah declines Leadership secondary

      // Micah's turn — plays Trade (primary replenishes commodities for all)
      t.choose(game, 'Strategic Action')
      // Trade primary fires: replenishes all → onCommoditiesReplenished → Trade Agreement triggers
      // Then Trade secondary offered to Dennis
      t.choose(game, 'Pass')  // Dennis declines Trade secondary

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Note returned to Micah
      expect(dennis.hasPromissoryNote('trade-agreement', 'micah')).toBe(false)
      expect(micah.hasPromissoryNote('trade-agreement', 'micah')).toBe(true)

      // Micah's commodities were given to Dennis as trade goods
      // Hacan commodity value = 6, so Dennis gets 6 TG, Micah has 0 commodities
      expect(micah.commodities).toBe(0)
      expect(dennis.tradeGoods).toBeGreaterThanOrEqual(6)
    })
  })

  // ---------------------------------------------------------------------------
  // Ceasefire (Rule 69)
  // ---------------------------------------------------------------------------

  describe('Ceasefire', () => {
    test('when owner activates system with holder units, owner cannot move ships in', () => {
      // Micah holds Dennis's ceasefire. Dennis activates a system with Micah's units.
      // Dennis should not be able to move ships into that system.
      const game = t.fixture()
      const target = findAdjacent('sol-home')
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            'sol-home': {
              space: ['cruiser', 'cruiser'],
              'jord': ['space-dock'],
            },
          },
        },
        micah: {
          promissoryNotes: [
            { id: 'ceasefire', owner: 'dennis' },
          ],
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
          units: {
            [target]: { space: ['fighter'] },
            'hacan-home': { 'arretze': ['space-dock'] },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis activates the system where Micah has a fighter
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: target })

      // Ceasefire triggers: Dennis cannot move ships in, note returned
      // Movement step is skipped — no move-ships prompt

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Note returned to Dennis
      expect(micah.hasPromissoryNote('ceasefire', 'dennis')).toBe(false)
      expect(dennis.hasPromissoryNote('ceasefire', 'dennis')).toBe(true)

      // Log should mention ceasefire
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Ceasefire'))).toBe(true)
    })
  })
})
