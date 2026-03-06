const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Yssaril Tribes', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual(expect.arrayContaining(['neural-motivator']))
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('yssaril-tribes')
      expect(faction.factionTechnologies.length).toBe(3)
      expect(faction.factionTechnologies.map(t => t.id).sort()).toEqual(
        ['deepgloom-executable', 'mageon-implants', 'transparasteel-plating']
      )
    })
  })

  describe('Stall Tactics', () => {
    test('can discard action card as component action', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          actionCards: ['focused-research', 'mining-initiative'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action.stall-tactics')
      t.choose(game, 'focused-research')

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBe(1)
      expect(dennis.actionCards[0].id).toBe('mining-initiative')
    })

    test('not available without action cards', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Without action cards, Stall Tactics is unavailable so Component Action shouldn't be offered
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Component Action')
    })
  })

  describe('Scheming', () => {
    test('draws 1 extra action card then discards 1', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      game.run()
      pickStrategyCards(game, 'politics', 'imperial')

      t.choose(game, 'Strategic Action.politics')
      // Speaker auto-resolves to micah (dennis is current speaker)

      const cardToDiscard = game.players.byName('dennis').actionCards[0].id
      t.choose(game, cardToDiscard)

      // Agenda deck peek
      t.choose(game, t.currentChoices(game)[0])
      t.choose(game, 'Top of deck')
      t.choose(game, 'Top of deck')

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBe(2)

      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.actionCards.length).toBe(2)
    })
  })

  describe('Crafty', () => {
    test('Yssaril can hold more than 7 action cards', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          actionCards: [
            'focused-research', 'mining-initiative', 'ghost-ship',
            'plague', 'uprising', 'sabotage', 'skilled-retreat',
            'direct-hit',
          ],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // dennis: allocate 3 tokens
      t.choose(game, 'Skip')         // dennis skips influence-for-tokens (Yssaril, 5I)
      // micah: leadership secondary auto-passes (Hacan 2I)
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Scheming: pick card to discard
      const dennisCards = game.players.byName('dennis').actionCards
      t.choose(game, dennisCards[0].id)

      t.choose(game, 'Done')
      t.choose(game, 'Done')

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBeGreaterThanOrEqual(8)
    })
  })

  describe('Agent — Ssruu', () => {
    test('has text ability of each other player agent', () => {
      // Dennis (Yssaril) pairs with Micah (Empyrean) — Ssruu copies Acamar
      const game = t.fixture({ factions: ['yssaril-tribes', 'empyrean'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
          tradeGoods: 0,
          commandTokens: { tactics: 3, strategy: 2, fleet: 3 },
          units: {
            'yssaril-home': {
              space: ['cruiser'],
              'retillion': ['space-dock', 'infantry'],
            },
          },
        },
        micah: {
          leaders: { agent: 'ready', commander: 'locked', hero: 'locked' },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis: Tactical Action — activate system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // Ssruu triggers: copy Empyrean agent (Acamar)
      t.choose(game, 'Ssruu as Acamar')
      t.choose(game, 'Gain 1 Trade Good')

      // Micah's Acamar also triggers — decline
      t.choose(game, 'Pass')

      // Move ships
      t.action(game, 'move-ships', {
        movements: [{ unitType: 'cruiser', from: 'yssaril-home', count: 1 }],
      })

      const dennis = game.players.byName('dennis')
      expect(dennis.isAgentReady()).toBe(false)
      expect(dennis.tradeGoods).toBeGreaterThanOrEqual(1)

      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('Ssruu'))).toBe(true)
    })
  })

  describe('Commander — So Ata', () => {
    test('look at opponent action cards when they activate system with your units', () => {
      // Dennis = Yssaril (with unlocked commander and units in system 27)
      // Micah = Hacan (activates system 27 where Yssaril has units)
      // So Ata reveals Micah's action cards.
      const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'unlocked', hero: 'locked' },
          units: {
            '27': {
              'new-albion': ['infantry'],
            },
          },
        },
        micah: {
          actionCards: ['sabotage', 'mining-initiative'],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['infantry', 'space-dock'],
            },
            '27': {
              space: ['cruiser'],
            },
          },
        },
      })
      game.run()
      // Dennis picks leadership (1), Micah picks diplomacy (2)
      // Dennis goes first (initiative 1)
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses strategic action first (must use strategy card before passing)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // dennis: allocate 3 tokens
      t.choose(game, 'Skip')  // dennis skips influence-for-tokens (Yssaril, 5I)

      // Micah does a tactical action — activates system 27 where Yssaril has infantry
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })

      // So Ata should have triggered — check log
      const logEntries = game.log._log.map(e => e.template || '')
      expect(logEntries.some(e => e.includes('So Ata'))).toBe(true)

      // Verify the log mentions the action card count
      const soAtaEntry = game.log._log.find(e => (e.template || '').includes('So Ata'))
      const count = soAtaEntry.args.count?.value ?? soAtaEntry.args.count
      expect(count).toBe(2)
    })
  })

  describe('Hero — Kyver, Blade and Key', () => {
    test('Guild of Spies: take action card from opponent, then purge', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          actionCards: ['focused-research'],
        },
        micah: {
          actionCards: ['mining-initiative', 'ghost-ship', 'plague'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action.yssaril-hero')

      // Micah shows 1 card (opponent chooses)
      t.choose(game, 'mining-initiative')

      // Dennis decides to take it
      t.choose(game, 'Take mining-initiative')

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.map(c => c.id)).toContain('mining-initiative')
      expect(dennis.isHeroPurged()).toBe(true)

      const micah = game.players.byName('micah')
      expect(micah.actionCards.map(c => c.id)).not.toContain('mining-initiative')
    })

    test('Guild of Spies: force opponent to discard 3 action cards', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'exhausted', commander: 'locked', hero: 'unlocked' },
          actionCards: ['focused-research'],
        },
        micah: {
          actionCards: ['mining-initiative', 'ghost-ship', 'plague', 'uprising'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action.yssaril-hero')

      // Micah shows 1 card
      t.choose(game, 'mining-initiative')

      // Dennis forces discard 3
      t.choose(game, 'Force Discard 3')

      const dennis = game.players.byName('dennis')
      expect(dennis.isHeroPurged()).toBe(true)

      // Micah started with 4, showed 1 (mining-initiative), but dennis forced discard 3
      // So micah should have 1 card remaining
      const micah = game.players.byName('micah')
      expect(micah.actionCards.length).toBe(1)
    })
  })

  describe('Mech — Blackshade Infiltrator', () => {
    test('DEPLOY: after Stall Tactics, offer to place 1 mech on controlled planet', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          actionCards: ['focused-research', 'mining-initiative'],
          units: {
            '27': {
              'new-albion': ['infantry', 'space-dock'],
            },
          },
          planets: {
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action.stall-tactics')
      t.choose(game, 'focused-research')

      // Blackshade Infiltrator DEPLOY: choose to deploy mech
      t.choose(game, 'Deploy Blackshade Infiltrator')

      // Choose planet (multiple controlled planets including home world)
      t.choose(game, 'new-albion')

      // Check for mech placement
      const planetUnits = game.state.units['27'].planets?.['new-albion'] || []
      const mechs = planetUnits.filter(u => u.owner === 'dennis' && u.type === 'mech')
      expect(mechs.length).toBe(1)
    })

    test('DEPLOY: can pass on mech deployment', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          actionCards: ['focused-research', 'mining-initiative'],
          units: {
            '27': {
              'new-albion': ['infantry', 'space-dock'],
            },
          },
          planets: {
            'new-albion': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Component Action.stall-tactics')
      t.choose(game, 'focused-research')

      // Pass on mech deploy
      t.choose(game, 'Pass')

      // No mech placed
      const planetUnits = game.state.units['27'].planets?.['new-albion'] || []
      const mechs = planetUnits.filter(u => u.owner === 'dennis' && u.type === 'mech')
      expect(mechs.length).toBe(0)
    })
  })

  describe('Promissory Note — Spy Net', () => {
    test('at start of turn, look at Yssaril hand and take 1 action card, then return', () => {
      // Dennis = Hacan (holder), Micah = Yssaril (owner)
      const game = t.fixture({ factions: ['emirates-of-hacan', 'yssaril-tribes'] })
      t.setBoard(game, {
        dennis: {
          promissoryNotes: [{ id: 'spy-net', owner: 'micah' }],
          actionCards: [],
          units: {
            'hacan-home': {
              space: ['carrier'],
              'arretze': ['space-dock'],
            },
          },
        },
        micah: {
          actionCards: ['sabotage', 'direct-hit'],
          units: {
            'yssaril-home': {
              space: ['carrier'],
              'retillion': ['space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // At Dennis's turn start, Spy Net triggers
      // Dennis chooses to play Spy Net
      t.choose(game, 'Play Spy Net')
      // Dennis chooses Sabotage from Yssaril's hand
      t.choose(game, 'Sabotage')

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Dennis took 1 action card from Yssaril
      expect(dennis.actionCards.some(c => c.id === 'sabotage')).toBe(true)
      expect(micah.actionCards.length).toBe(1)
      expect(micah.actionCards[0].id).toBe('direct-hit')

      // PN returned to Yssaril
      const micahPNs = micah.getPromissoryNotes()
      expect(micahPNs.some(n => n.id === 'spy-net')).toBe(true)
    })
  })

  describe('Faction Technologies', () => {
    describe('Mageon Implants', () => {
      test('steal 1 action card from another player', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['mageon-implants'],
            actionCards: ['focused-research'],
          },
          micah: {
            actionCards: ['mining-initiative', 'ghost-ship'],
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Component Action.mageon-implants')

        // Opponent auto-selects (only 1 opponent in 2p game)
        // Choose card to steal
        t.choose(game, 'mining-initiative')

        const dennis = game.players.byName('dennis')
        expect(dennis.actionCards.length).toBe(2)
        expect(dennis.actionCards.map(c => c.id)).toContain('mining-initiative')

        const micah = game.players.byName('micah')
        expect(micah.actionCards.length).toBe(1)
        expect(micah.actionCards[0].id).toBe('ghost-ship')

        // Tech should be exhausted
        expect(dennis.exhaustedTechs).toContain('mageon-implants')
      })

      test('not available when exhausted', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['mageon-implants'],
            actionCards: ['focused-research'],
          },
          micah: {
            actionCards: ['mining-initiative', 'ghost-ship'],
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // First use — steals a card
        t.choose(game, 'Component Action.mageon-implants')
        // Opponent auto-selects (1 opponent in 2p)
        // Choose which card to take
        t.choose(game, 'mining-initiative')

        // Tech should be exhausted after use
        const dennis = game.players.byName('dennis')
        expect(dennis.exhaustedTechs).toContain('mageon-implants')

        // Verify mageon-implants is not in the available component actions
        const actions = game.factionAbilities.getAvailableComponentActions(dennis)
        const mageonAction = actions.find(a => a.id === 'mageon-implants')
        expect(mageonAction).toBeUndefined()
      })
    })

    describe('Transparasteel Plating', () => {
      test('passive ability is registered', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        t.setBoard(game, {
          dennis: {
            technologies: ['transparasteel-plating'],
          },
        })
        game.run()

        // Verify the handler has the ability method
        const { getHandler } = require('../../systems/factions/index.js')
        const handler = getHandler('yssaril-tribes')
        const dennis = game.players.byName('dennis')
        expect(handler.canPassedPlayersPlayActionCards(dennis)).toBe(false)
      })

      test('returns true without the tech', () => {
        const game = t.fixture({
          factions: ['yssaril-tribes', 'emirates-of-hacan'],
        })
        game.run()

        const { getHandler } = require('../../systems/factions/index.js')
        const handler = getHandler('yssaril-tribes')
        const dennis = game.players.byName('dennis')
        expect(handler.canPassedPlayersPlayActionCards(dennis)).toBe(true)
      })
    })

    describe('Deepgloom Executable', () => {
      test('share Stall Tactics with other player', () => {
        // Dennis = Yssaril (with Deepgloom), Micah = Hacan (can use shared Stall Tactics)
        const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['deepgloom-executable'],
          },
          micah: {
            actionCards: ['focused-research', 'mining-initiative'],
          },
        })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        // Dennis uses strategic action (leadership)
        t.choose(game, 'Strategic Action.leadership')
        t.choose(game, 'Done')  // dennis: allocate 3 tokens
        t.choose(game, 'Skip') // dennis skips influence-for-tokens (Yssaril, 5I)

        // Micah's turn — use shared Stall Tactics via Deepgloom
        t.choose(game, 'Component Action.stall-tactics-deepgloom')

        // Yssaril (Dennis) approves
        t.choose(game, 'Allow')

        // Micah discards an action card
        t.choose(game, 'focused-research')

        // Skip transaction
        t.choose(game, 'Pass')

        const micah = game.players.byName('micah')
        expect(micah.actionCards.length).toBe(1)
        expect(micah.actionCards[0].id).toBe('mining-initiative')
      })

      test('share Scheming when other player draws action cards', () => {
        // Dennis = Yssaril (with Deepgloom), Micah = Hacan (draws action cards)
        const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
        t.setBoard(game, {
          dennis: {
            technologies: ['deepgloom-executable'],
          },
        })
        game.run()
        pickStrategyCards(game, 'politics', 'imperial')

        // Dennis uses politics: speaker auto-resolves to micah (dennis is current speaker)
        t.choose(game, 'Strategic Action.politics')

        // Scheming for Dennis: discard 1 (Dennis drew 2 + 1 extra = 3, discard 1 = 2)
        const dennisCards = game.players.byName('dennis').actionCards
        t.choose(game, dennisCards[0].id)

        // Agenda deck peek
        t.choose(game, t.currentChoices(game)[0])
        t.choose(game, 'Top of deck')
        t.choose(game, 'Top of deck')

        // Micah secondary: draw 2 action cards
        t.choose(game, 'Use Secondary')

        // Deepgloom: Dennis shares Scheming with Micah
        t.choose(game, 'Share Scheming')

        // Micah's Scheming: discard 1 (Micah drew 2 + 1 extra from Scheming = 3, discard 1 = 2)
        const micahCards = game.players.byName('micah').actionCards
        t.choose(game, micahCards[0].id)

        // Transaction offer from Deepgloom
        t.choose(game, 'Pass')

        const micah = game.players.byName('micah')
        expect(micah.actionCards.length).toBe(2)
      })
    })
  })
})
