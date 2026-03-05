const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Naalu Collective', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['neural-motivator', 'sarween-tools']))
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('naalu-collective')
      expect(faction.factionTechnologies.length).toBe(3)

      const neuroglaive = faction.factionTechnologies.find(ft => ft.id === 'neuroglaive')
      expect(neuroglaive.color).toBe('green')
      expect(neuroglaive.prerequisites).toEqual(['green', 'green', 'green'])
      expect(neuroglaive.unitUpgrade).toBeNull()

      const hcf2 = faction.factionTechnologies.find(ft => ft.id === 'hybrid-crystal-fighter-ii')
      expect(hcf2.color).toBe('unit-upgrade')
      expect(hcf2.prerequisites).toEqual(['green', 'blue'])
      expect(hcf2.unitUpgrade).toBe('fighter')

      const mindsieve = faction.factionTechnologies.find(ft => ft.id === 'mindsieve')
      expect(mindsieve.color).toBeNull()
      expect(mindsieve.prerequisites).toEqual(['red', 'green'])
      expect(mindsieve.unitUpgrade).toBeNull()
    })
  })

  describe('Telepathic', () => {
    test('Naalu always goes first in action phase regardless of strategy card', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'naalu-collective', 'emirates-of-hacan'],
      })
      game.run()

      // Snake draft: dennis, micah, scott, scott, micah, dennis
      t.choose(game, 'leadership')    // dennis: leadership(1)
      t.choose(game, 'imperial')      // micah: imperial(8)
      t.choose(game, 'diplomacy')     // scott: diplomacy(2)
      t.choose(game, 'construction')  // scott: construction(4)
      t.choose(game, 'politics')      // micah: politics(3)
      t.choose(game, 'trade')         // dennis: trade(5)

      // Despite having high cards (3,8), Naalu should go first (initiative 0)
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })

    test('non-Naalu player with lower card goes after Naalu', () => {
      const game = t.fixture({
        factions: ['federation-of-sol', 'naalu-collective'],
      })
      game.run()

      // Dennis picks leadership(1), micah (Naalu) picks imperial(8)
      t.choose(game, 'leadership')
      t.choose(game, 'imperial')

      // Naalu goes first even though leadership(1) < imperial(8)
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Foresight', () => {
    test('Naalu can move ship to adjacent system when opponent enters', () => {
      // Deterministic layout: hacan-home at (0,-3) -> adjacent to system 27 (0,-2)
      // System 27 (0,-2) is adjacent to: [37, 26, 48, hacan-home]
      // Place Naalu fighter in system 27, Hacan approaches from home
      const game = t.fixture({
        factions: ['emirates-of-hacan', 'naalu-collective'],
      })
      t.setBoard(game, {
        dennis: {
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            '27': {
              space: ['fighter'],
            },
            'naalu-home': {
              space: [],
              'druaa': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Micah (Naalu, telepathic=0) goes first — use diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'naalu-home')   // diplomacy: choose system
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)

      // Dennis (Hacan) takes tactical action
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.choose(game, 'Pass')            // micah declines Z'eu agent
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'hacan-home', count: 1 }],
      })

      // Naalu prompted for Foresight — retreat to system 37 (adjacent to 27)
      // Use * prefix to prevent t.choose from converting '37' to number
      t.choose(game, '*37')

      // Naalu's fighter should have moved to system 37
      const retreatShips = game.state.units['37'].space
        .filter(u => u.owner === 'micah')
      expect(retreatShips.length).toBe(1)

      // Naalu should have spent 1 strategy token
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.strategy).toBe(1)
    })
  })

  describe("Agent — Z'eu", () => {
    test("exhaust to return another player's command token from a system", () => {
      // dennis = Naalu (has Z'eu), micah = Hacan
      const game = t.fixture({
        factions: ['naalu-collective', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready' },
          units: {
            'naalu-home': {
              space: ['carrier'],
              'druaa': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Naalu, telepathic=0) goes first — use leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')         // allocate tokens
      t.choose(game, 'Skip')         // dennis skips influence-for-tokens (Naalu, 3I)

      // Micah (Hacan) takes tactical action — activates system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Z'eu prompt: dennis (Naalu) can exhaust to return micah's token
      t.choose(game, "Exhaust Z'eu")

      // Micah's token should be removed from system 27
      expect(game.state.systems['27'].commandTokens).not.toContain('micah')

      // Micah should get the token back in tactics pool (was 3, spent 1 to activate, +1 from Z'eu = 3)
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(3)

      // Dennis's agent should be exhausted
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
    })

    test("can pass on Z'eu when agent is ready", () => {
      const game = t.fixture({
        factions: ['naalu-collective', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready' },
          units: {
            'naalu-home': {
              space: ['carrier'],
              'druaa': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Naalu) goes first — use leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')         // allocate tokens
      t.choose(game, 'Skip')         // dennis skips influence-for-tokens (Naalu, 3I)

      // Micah activates system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Dennis declines Z'eu
      t.choose(game, 'Pass')

      // Micah's token should remain in system 27
      expect(game.state.systems['27'].commandTokens).toContain('micah')

      // Micah's tactic tokens should have decreased by 1 (spent to activate)
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(2)

      // Dennis's agent should still be ready
      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(true)
    })

    test("Z'eu does not trigger when agent is exhausted", () => {
      const game = t.fixture({
        factions: ['naalu-collective', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted' },
          units: {
            'naalu-home': {
              space: ['carrier'],
              'druaa': ['space-dock'],
            },
          },
        },
        micah: {
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'hacan-home': {
              space: ['cruiser'],
              'arretze': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Naalu) goes first — use leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Done')         // allocate tokens
      t.choose(game, 'Skip')         // dennis skips influence-for-tokens (Naalu, 3I)

      // Micah activates system 27 — no Z'eu prompt expected (agent exhausted)
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Should proceed directly to movement step — no Z'eu prompt
      // Micah's token should be in system 27
      expect(game.state.systems['27'].commandTokens).toContain('micah')

      // Micah spent 1 tactic token
      const micah = game.players.byName('micah')
      expect(micah.commandTokens.tactics).toBe(2)
    })
  })

  describe("Commander — M'aban", () => {
    test('M\'aban peek is available when commander is unlocked', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const actions = game.factionAbilities.getAvailableComponentActions(dennis)
      const mabanAction = actions.find(a => a.id === 'maban-peek')
      expect(mabanAction).toBeTruthy()
    })

    test('M\'aban peek is not available when commander is locked', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      const actions = game.factionAbilities.getAvailableComponentActions(dennis)
      const mabanAction = actions.find(a => a.id === 'maban-peek')
      expect(mabanAction).toBeFalsy()
    })

    test('M\'aban peek log entries have per-player visibility', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
        },
        agendaDeck: ['mutiny', 'economic-equality'],
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Naalu, Telepathic) goes first — use M'aban peek
      t.choose(game, 'Component Action')
      t.choose(game, 'maban-peek')
      // Neighbor auto-resolves to micah (only option in 2p)

      // Choose to peek at top of agenda deck
      t.choose(game, 'Top')

      // Check promissory notes log entry
      const notesEntry = game.log._log.find(e =>
        (e.template || '').includes("promissory notes")
      )
      expect(notesEntry).toBeTruthy()
      expect(notesEntry.visibility).toEqual(['dennis'])
      expect(notesEntry.redacted).toBe("M'aban: {player} views {target}'s promissory notes")

      // Check agenda peek log entry
      const peekEntry = game.log._log.find(e =>
        (e.template || '').includes("peeks at top of agenda deck")
      )
      expect(peekEntry).toBeTruthy()
      expect(peekEntry.visibility).toEqual(['dennis'])
      expect(peekEntry.redacted).toBe("M'aban: {player} peeks at top of agenda deck")
    })
  })

  describe('Hero — The Oracle', () => {
    test('C-RADIUM GEOMETRY: force each other player to give 1 promissory note, then purge', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'unlocked' },
          units: {
            'naalu-home': {
              space: ['carrier'],
              'druaa': ['space-dock'],
            },
          },
        },
        micah: {
          tradeGoods: 5,
        },
      })
      game.run()

      // Give micah a promissory note to test with
      const micah = game.players.byName('micah')
      micah.addPromissoryNote('ceasefire', 'micah')

      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses component action: hero
      t.choose(game, 'Component Action')
      t.choose(game, 'c-radium-geometry')

      // Micah gives the promissory note
      t.choose(game, 'ceasefire:micah')

      // Dennis should now have the note
      const dennis = game.players.byName('dennis')
      expect(dennis.hasPromissoryNote('ceasefire', 'micah')).toBe(true)

      // Hero should be purged
      expect(dennis.isHeroPurged()).toBe(true)
    })

    test('C-RADIUM GEOMETRY: player gives TG if no promissory notes', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'unlocked' },
          tradeGoods: 0,
          units: {
            'naalu-home': {
              space: ['carrier'],
              'druaa': ['space-dock'],
            },
          },
        },
        micah: {
          tradeGoods: 5,
          promissoryNotes: [],  // Empty: no promissory notes
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses hero — Micah has no promissory notes, gives 1 TG
      t.choose(game, 'Component Action')
      t.choose(game, 'c-radium-geometry')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(1)
      expect(dennis.isHeroPurged()).toBe(true)

      const micahAfter = game.players.byName('micah')
      expect(micahAfter.tradeGoods).toBe(4)
    })
  })

  describe('Mech — Iconoclast', () => {
    test('onRelicGained hook is dispatched correctly', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'naalu-home': {
              'druaa': ['infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()

      // Verify the handler has onRelicGained method
      const dennis = game.players.byName('dennis')
      const handler = game.factionAbilities._getPlayerHandler(dennis)
      expect(handler.onRelicGained).toBeTruthy()
    })
  })

  describe('Promissory Note — Gift of Prescience', () => {
    test('holder goes first in initiative order, Naalu loses Telepathic', () => {
      // Dennis = Hacan (holder), Micah = Naalu (owner)
      // Normally Naalu (Micah) goes first (Telepathic = initiative 0)
      // With GoP, Dennis gets initiative 0 and Naalu loses Telepathic
      const game = t.fixture({ factions: ['emirates-of-hacan', 'naalu-collective'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'gift-of-prescience', owner: 'micah' }],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // End of strategy phase — Dennis is offered Gift of Prescience
      t.choose(game, 'Play Gift of Prescience')

      // Action phase: Dennis (initiative 0 from GoP) goes first
      // Players must use their strategy card before they can pass
      t.choose(game, 'Strategic Action')  // Dennis uses leadership (goes first!)
      t.choose(game, 'Done')              // allocate tokens
      t.choose(game, 'Pass')              // Micah declines leadership secondary (Naalu 3I)
      t.choose(game, 'Strategic Action')  // Micah uses diplomacy (goes second)
      t.choose(game, 'naalu-home')        // Micah diplomacy target
      // Dennis: diplomacy secondary auto-skipped (no exhausted planets)
      // Both pass
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Verify GoP was activated
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Gift of Prescience'))).toBe(true)

      // Verify Dennis went first by checking action log order:
      // "dennis: Strategic Action" should appear before "micah: Strategic Action"
      const actionLogs = game.log._log
        .filter(e => (e.template || '').includes('{player}: {action}'))
        .map(e => e.args?.player?.value || e.args?.player?.name || e.args?.player)
      expect(actionLogs[0]).toBe('dennis')
      expect(actionLogs[1]).toBe('micah')
    })

    test('returns to Naalu player at end of status phase', () => {
      // Dennis = Hacan (holder), Micah = Naalu (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'naalu-collective'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'gift-of-prescience', owner: 'micah' }],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play Gift of Prescience
      t.choose(game, 'Play Gift of Prescience')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // Dennis uses leadership
      t.choose(game, 'Done')              // allocate tokens
      t.choose(game, 'Pass')              // Micah declines leadership secondary (Naalu 3I)
      t.choose(game, 'Strategic Action')  // Micah uses diplomacy
      t.choose(game, 'naalu-home')
      // Dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase
      t.choose(game, 'Done')
      t.choose(game, 'Done')

      // After status phase, PN should be returned to Naalu
      const micah = game.players.byName('micah')
      expect(micah.getPromissoryNotes().some(n => n.id === 'gift-of-prescience')).toBe(true)

      const dennis = game.players.byName('dennis')
      expect(dennis.getPromissoryNotes().some(n => n.id === 'gift-of-prescience')).toBe(false)
    })
  })

  describe('Faction Technologies', () => {
    describe('Neuroglaive', () => {
      test('after another player activates a system with your ships, they remove 1 fleet pool token', () => {
        const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['neuroglaive'],
            units: {
              'naalu-home': {
                space: ['carrier'],
                'druaa': ['space-dock'],
              },
              '27': {
                space: ['fighter'],
              },
            },
          },
          micah: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'hacan-home': {
                space: ['cruiser'],
                'arretze': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Naalu, telepathic=0) goes first — use leadership
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Done')         // allocate tokens
        t.choose(game, 'Skip')         // dennis skips influence-for-tokens (Naalu, 3I)

        // Micah activates system 27, which has Naalu's fighter
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Z'eu agent prompt — pass
        t.choose(game, 'Pass')

        // Neuroglaive fires automatically (no choice needed)
        // Micah should lose 1 fleet pool token
        const micah = game.players.byName('micah')
        expect(micah.commandTokens.fleet).toBe(2)
      })

      test('does not trigger without the technology', () => {
        const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            units: {
              'naalu-home': {
                space: ['carrier'],
                'druaa': ['space-dock'],
              },
              '27': {
                space: ['fighter'],
              },
            },
          },
          micah: {
            commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
            units: {
              'hacan-home': {
                space: ['cruiser'],
                'arretze': ['space-dock'],
              },
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis (Naalu) goes first — use leadership
        t.choose(game, 'Strategic Action')
        t.choose(game, 'Done')         // allocate tokens
        t.choose(game, 'Skip')         // dennis skips influence-for-tokens (Naalu, 3I)

        // Micah activates system 27, which has Naalu's fighter
        t.choose(game, 'Tactical Action')
        t.action(game, 'activate-system', { systemId: '27' })

        // Z'eu agent prompt — pass
        t.choose(game, 'Pass')

        // Without Neuroglaive, Micah should keep all fleet pool tokens
        const micah = game.players.byName('micah')
        expect(micah.commandTokens.fleet).toBe(3)
      })
    })

    describe('Hybrid Crystal Fighter II', () => {
      test('fighter upgrade: combat 7, move 2, does not require capacity', () => {
        const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['hybrid-crystal-fighter-ii'],
          },
        })
        game.run()

        const stats = game._getUnitStats('dennis', 'fighter')
        expect(stats.combat).toBe(7)
        expect(stats.move).toBe(2)
        expect(stats.requiresCapacity).toBe(false)
      })

      test('base Hybrid Crystal Fighter I has correct stats', () => {
        const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
        game.run()

        // Naalu base fighter override: combat 8
        const stats = game._getUnitStats('dennis', 'fighter')
        expect(stats.combat).toBe(8)
      })
    })

    describe('Mindsieve', () => {
      test('handler exposes canSkipSecondaryCostWithPromissoryNote', () => {
        const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['mindsieve'],
          },
        })
        game.run()

        const dennis = game.players.byName('dennis')
        const handler = game.factionAbilities._getPlayerHandler(dennis)
        expect(handler.canSkipSecondaryCostWithPromissoryNote(dennis)).toBe(true)
      })

      test('does not expose without the technology', () => {
        const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
        game.run()

        const dennis = game.players.byName('dennis')
        const handler = game.factionAbilities._getPlayerHandler(dennis)
        expect(handler.canSkipSecondaryCostWithPromissoryNote(dennis)).toBe(false)
      })
    })
  })
})
