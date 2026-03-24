const t = require('../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Strategic Actions', () => {
  describe('Leadership (#1)', () => {
    test('primary: gain 3 command tokens', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis has leadership, uses it
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate 3 tokens

      const dennis = game.players.byName('dennis')
      // Started with tactics=3, gained 3 from Leadership
      expect(dennis.commandTokens.tactics).toBe(6)
    })
  })

  describe('Trade (#5)', () => {
    test('primary: gain 3 trade goods and replenish commodities', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis has trade(5), micah has imperial(8). Dennis goes first.
      t.choose(game, 'Strategic Action.trade')
      // Trade has no secondary — no Pass needed

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)
      // Sol has 4 max commodities
      expect(dennis.commodities).toBe(4)
    })

    test('primary: active player chooses who gets free secondary', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      t.choose(game, 'Strategic Action.trade')
      // Dennis chooses micah for free secondary
      t.choose(game, 'micah')
      // Micah accepts free secondary
      t.choose(game, 'Use Secondary')

      // Micah (Hacan) has 6 max commodities
      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)
      expect(micah.commandTokens.strategy).toBe(2)  // free, no token spent
    })
  })

  describe('Technology (#7)', () => {
    test('primary: research one technology', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      // Dennis has technology(7), micah has imperial(8). Dennis goes first.
      t.choose(game, 'Strategic Action.technology')

      // Sol starts with neural-motivator (green) + antimass-deflectors (blue)
      // Sarween Tools has no prerequisites — should be available
      t.choose(game, 'sarween-tools')
      // Micah can't afford tech secondary (Hacan has 3R < 4R required), skipped

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('sarween-tools')).toBe(true)
    })

    test('primary: can research tech matching prerequisites', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action.technology')

      // Sol has 1 blue (antimass) — can research gravity-drive (needs 1 blue)
      t.choose(game, 'gravity-drive')
      // Micah can't afford tech secondary (Hacan has 3R < 4R required), skipped

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('gravity-drive')).toBe(true)
    })

    test('researched tech only available choices that meet prerequisites', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'technology', 'imperial')

      t.choose(game, 'Strategic Action.technology')

      // Check available choices — should not include fleet-logistics (needs 2 blue)
      const choices = t.currentChoices(game)
      expect(choices).toContain('sarween-tools')
      expect(choices).toContain('gravity-drive')
      expect(choices).not.toContain('fleet-logistics')  // needs 2 blue, only has 1
    })
  })

  describe('Imperial (#8)', () => {
    test('primary: gain 1 VP if controlling Mecatol Rex', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')  // micah: allocate 3 tokens
      t.choose(game, 'Pass')  // dennis declines leadership secondary (has Mecatol Rex, 8I)
      // Dennis uses imperial
      t.choose(game, 'Strategic Action.imperial')
      t.choose(game, 'Pass')  // micah declines imperial secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.victoryPoints).toBe(1)
    })

    test('primary: no VP without Mecatol Rex', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')  // micah: allocate 3 tokens
      // Dennis uses imperial
      t.choose(game, 'Strategic Action.imperial')
      t.choose(game, 'Pass')  // micah declines imperial secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.victoryPoints).toBe(0)
    })
  })

  describe('Diplomacy (#2)', () => {
    test('primary: choose system and place command tokens for other players', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'diplomacy', 'trade')

      // Dennis has diplomacy(2), micah has trade(5). Dennis goes first.
      t.choose(game, 'Strategic Action.diplomacy')

      // Dennis must choose a system with a planet he controls
      // Sol controls 'jord' in 'sol-home'
      t.choose(game, 'sol-home')
      // Micah has no exhausted planets — diplomacy secondary auto-skipped

      // Micah should now have a command token in sol-home
      expect(game.state.systems['sol-home'].commandTokens).toContain('micah')
    })

    test('primary: deducts command token from affected player (Rule 32)', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'diplomacy', 'trade')

      const micahBefore = game.players.byName('micah')
      const tacticsBefore = micahBefore.commandTokens.tactics

      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'sol-home')
      // Micah has no exhausted planets — diplomacy secondary auto-skipped

      const micah = game.players.byName('micah')
      // Token placed in sol-home AND deducted from micah's tactics pool
      expect(game.state.systems['sol-home'].commandTokens).toContain('micah')
      expect(micah.commandTokens.tactics).toBe(tacticsBefore - 1)
    })

    test('primary: no token placed if player has no command tokens', () => {
      const game = t.fixture()
      t.setBoard(game, {
        micah: { commandTokens: { tactics: 0, fleet: 0, strategy: 0 } },
      })
      game.run()
      pickStrategyCards(game, 'diplomacy', 'trade')

      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'sol-home')
      // Micah has no tokens — cannot place, no secondary prompt either

      // No token placed for micah
      expect(game.state.systems['sol-home'].commandTokens).not.toContain('micah')
    })

    test('primary: readies up to 2 exhausted planets', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'jord': { exhausted: true },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'diplomacy', 'trade')

      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'sol-home')
      // Micah has no exhausted planets — diplomacy secondary auto-skipped

      // Dennis's exhausted planet should be readied by primary
      expect(game.state.planets['jord'].exhausted).toBe(false)
    })
  })

  describe('Politics (#3)', () => {
    test('primary: choose new speaker', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'politics', 'trade')

      // Dennis has politics(3), micah has trade(5). Dennis goes first.
      t.choose(game, 'Strategic Action.politics')

      // Dennis is current speaker — only micah is eligible (auto-resolves in 2p)
      // Agenda deck peek: pick first card, place top, then remaining card, place top
      t.choose(game, t.currentChoices(game)[0])
      t.choose(game, 'Top of deck')
      t.choose(game, 'Top of deck')
      t.choose(game, 'Pass')  // micah declines politics secondary

      expect(game.state.speaker).toBe('micah')
    })

    test('primary: current speaker is not eligible', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'politics', 'trade')

      expect(game.state.speaker).toBe('dennis')

      t.choose(game, 'Strategic Action.politics')
      // Auto-resolves to micah (only eligible player)
      // Agenda deck peek: pick first card, place top, then remaining card, place top
      t.choose(game, t.currentChoices(game)[0])
      t.choose(game, 'Top of deck')
      t.choose(game, 'Top of deck')
      t.choose(game, 'Pass')  // micah declines politics secondary

      // Speaker must change — current speaker excluded from choices
      expect(game.state.speaker).toBe('micah')
    })

    test('primary: agenda deck peek rearranges cards', () => {
      const game = t.fixture()
      t.setBoard(game, {
        agendaDeck: ['mutiny', 'economic-equality', 'seed-of-an-empire'],
      })
      game.run()
      pickStrategyCards(game, 'politics', 'trade')

      t.choose(game, 'Strategic Action.politics')
      // Speaker auto-resolves to micah

      // Agenda peek: see mutiny and economic-equality
      // Place economic-equality on top, mutiny on bottom
      t.choose(game, 'economic-equality: Economic Equality')
      t.choose(game, 'Top of deck')
      t.choose(game, 'Bottom of deck')
      t.choose(game, 'Pass')  // micah declines secondary

      // Deck should now be: [economic-equality, seed-of-an-empire, ..., mutiny]
      expect(game.state.agendaDeck[0].id).toBe('economic-equality')
      expect(game.state.agendaDeck[1].id).toBe('seed-of-an-empire')
      expect(game.state.agendaDeck[game.state.agendaDeck.length - 1].id).toBe('mutiny')
    })

    test('primary: agenda peek log has per-player visibility', () => {
      const game = t.fixture()
      t.setBoard(game, {
        agendaDeck: ['mutiny', 'economic-equality', 'seed-of-an-empire'],
      })
      game.run()
      pickStrategyCards(game, 'politics', 'trade')

      t.choose(game, 'Strategic Action.politics')
      t.choose(game, 'economic-equality: Economic Equality')
      t.choose(game, 'Top of deck')
      t.choose(game, 'Bottom of deck')
      t.choose(game, 'Pass')

      const placeEntries = game.log._log.filter(e =>
        (e.template || '').includes('places') && (e.template || '').includes('of the deck')
      )
      expect(placeEntries.length).toBe(2)

      for (const entry of placeEntries) {
        expect(entry.visibility).toEqual(['dennis'])
        expect(entry.redacted).toBe('{player} places an agenda card on the {position} of the deck')
        // Full template includes card name
        expect(entry.template).toContain('{card}')
      }
    })

    test('primary: action card draw log has per-player visibility', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'politics', 'trade')

      t.choose(game, 'Strategic Action.politics')
      t.choose(game, t.currentChoices(game)[0])
      t.choose(game, 'Top of deck')
      t.choose(game, 'Top of deck')
      t.choose(game, 'Pass')

      const drawEntries = game.log._log.filter(e =>
        (e.template || '').includes('draws') && (e.template || '').includes('action cards')
      )
      expect(drawEntries.length).toBeGreaterThanOrEqual(1)

      const dennisDrawEntry = drawEntries.find(e =>
        e.visibility && e.visibility.includes('dennis')
      )
      expect(dennisDrawEntry).toBeTruthy()
      expect(dennisDrawEntry.redacted).toBe('{player} draws {count} action cards')
      // Full template includes card names
      expect(dennisDrawEntry.template).toContain('{cards}')
    })
  })

  describe('Construction (#4)', () => {
    test('primary: place PDS and then another PDS', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'construction', 'trade')

      // Dennis has construction(4), micah has trade(5). Dennis goes first.
      t.choose(game, 'Strategic Action.construction')

      // Step 1: choose mode, then place PDS on jord
      t.choose(game, 'Place Structure')
      t.choose(game, 'Federation of Sol:Jord.pds')
      // Step 2: place another PDS on jord
      t.choose(game, 'Federation of Sol:Jord')
      t.choose(game, 'pds')
      t.choose(game, 'Pass')  // micah declines construction secondary

      const jord = game.state.units['sol-home'].planets['jord']
      const pdsCount = jord.filter(u => u.owner === 'dennis' && u.type === 'pds').length
      expect(pdsCount).toBe(2)
    })

    test('primary: place space dock then PDS', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'construction', 'trade')

      t.choose(game, 'Strategic Action.construction')

      // Step 1: space dock on jord
      t.choose(game, 'Place Structure')
      t.choose(game, 'Federation of Sol:Jord.space-dock')
      // Step 2: PDS on jord
      t.choose(game, 'Federation of Sol:Jord')
      t.choose(game, 'pds')
      t.choose(game, 'Pass')  // micah declines construction secondary

      const jord = game.state.units['sol-home'].planets['jord']
      const spaceDockCount = jord.filter(u => u.owner === 'dennis' && u.type === 'space-dock').length
      const pdsCount = jord.filter(u => u.owner === 'dennis' && u.type === 'pds').length
      // Started with 1 space dock, built another
      expect(spaceDockCount).toBe(2)
      expect(pdsCount).toBe(1)
    })

    test('primary: use production instead of placing structure', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'construction', 'trade')

      const fightersBefore = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter').length

      // Dennis has construction(4), micah has trade(5). Dennis goes first.
      t.choose(game, 'Strategic Action.construction')

      // Step 1: use production ability of space dock on jord
      // (sol-home auto-resolves as only system with docks)
      t.choose(game, 'Use Production')
      // Produce 1 fighter (cheapest unit)
      t.action(game, 'produce-units', { units: [{ type: 'fighter', count: 1 }] })
      // Step 2: place PDS on jord
      t.choose(game, 'Federation of Sol:Jord')
      t.choose(game, 'pds')
      t.choose(game, 'Pass')  // micah declines construction secondary

      const fightersAfter = game.state.units['sol-home'].space
        .filter(u => u.owner === 'dennis' && u.type === 'fighter').length
      expect(fightersAfter).toBe(fightersBefore + 1)

      const jord = game.state.units['sol-home'].planets['jord']
      const pdsCount = jord.filter(u => u.owner === 'dennis' && u.type === 'pds').length
      expect(pdsCount).toBe(1)
    })

    test('primary: skip step 2 with Done', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'construction', 'trade')

      t.choose(game, 'Strategic Action.construction')

      // Step 1: place PDS on jord
      t.choose(game, 'Place Structure')
      t.choose(game, 'Federation of Sol:Jord.pds')
      // Step 2: skip
      t.choose(game, 'Done')
      t.choose(game, 'Pass')  // micah declines construction secondary

      const jord = game.state.units['sol-home'].planets['jord']
      const pdsCount = jord.filter(u => u.owner === 'dennis' && u.type === 'pds').length
      expect(pdsCount).toBe(1)
    })
  })

  describe('Warfare (#6)', () => {
    test('primary: remove command token from board and redistribute', () => {
      const game = t.fixture()
      game.run()

      // Find an adjacent system to sol-home
      const targetSystem = game._getAdjacentSystems('sol-home')[0]

      pickStrategyCards(game, 'warfare', 'imperial')

      // Dennis has warfare(6), micah has imperial(8). Dennis goes first.
      // First, use tactical action to place a token on target system
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: targetSystem })
      t.choose(game, 'Done')  // skip movement (no production since no space dock)

      // Verify token was placed
      expect(game.state.systems[targetSystem].commandTokens).toContain('dennis')

      // Micah uses imperial (no Mecatol = no VP)
      t.choose(game, 'Strategic Action.imperial')
      t.choose(game, 'Pass')  // dennis declines imperial secondary

      // Dennis uses warfare — should see the token to remove
      t.choose(game, 'Strategic Action.warfare')
      t.choose(game, '*' + targetSystem)  // remove token (* prefix keeps as string)
      t.choose(game, 'Done')  // redistribution
      t.choose(game, 'Pass')  // micah declines warfare secondary

      // Token should be removed
      expect(game.state.systems[targetSystem].commandTokens).not.toContain('dennis')
    })
  })

  describe('Secondaries', () => {
    test('secondary system tracks last strategy card used', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
      t.choose(game, 'Done')  // dennis: allocate 3 tokens

      expect(game.state.lastStrategyCard).toBe('leadership')
    })

    test('other players can resolve secondary', () => {
      const game = t.fixture()
      t.setBoard(game, {
        micah: {
          planets: {
            'arretze': { exhausted: true },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'diplomacy', 'construction')

      // Dennis has diplomacy(2), micah has construction(4). Dennis goes first.
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'sol-home')  // diplomacy: choose system
      // Micah selects exhausted planet to ready (costs 1 strategy token)
      t.choose(game, 'arretze')

      const micah = game.players.byName('micah')
      // Strategy: 2 - 1 (spent) = 1
      expect(micah.commandTokens.strategy).toBe(1)
      expect(game.state.planets['arretze'].exhausted).toBe(false)
    })

    test('secondary costs strategy command token', () => {
      const game = t.fixture()
      t.setBoard(game, {
        micah: {
          commandTokens: { tactics: 3, strategy: 0, fleet: 3 },
        },
      })
      game.run()
      pickStrategyCards(game, 'diplomacy', 'construction')

      // Dennis has diplomacy(2), micah has construction(4). Dennis goes first.
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'sol-home')  // diplomacy: choose system
      // Micah has 0 strategy tokens — should NOT be prompted for diplomacy secondary

      // Should go straight to micah's turn without secondary prompt
      expect(game.waiting.selectors[0].actor).toBe('micah')
      expect(game.waiting.selectors[0].title).toBe('Choose Action')
    })

    test('secondary: skips when no exhausted planets', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'diplomacy', 'construction')

      // Dennis has diplomacy(2), micah has construction(4). Dennis goes first.
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'sol-home')  // diplomacy: choose system
      // Micah has no exhausted planets — auto-skipped, no prompt

      // Should go straight to micah's turn
      expect(game.waiting.selectors[0].actor).toBe('micah')
      expect(game.waiting.selectors[0].title).toBe('Choose Action')
    })

    test('diplomacy secondary: ready 2 exhausted planets', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          planets: {
            'jord': { exhausted: true },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis has leadership(1), micah has diplomacy(2). Dennis goes first.
      t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
      t.choose(game, 'Done')  // dennis: allocate 3 tokens
      // Micah uses diplomacy
      t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
      t.choose(game, 'hacan-home')  // micah protects hacan-home
      // Dennis uses diplomacy secondary — select exhausted planet
      t.choose(game, 'jord')

      const dennis = game.players.byName('dennis')
      expect(game.state.planets['jord'].exhausted).toBe(false)
      // Spent 1 strategy token
      expect(dennis.commandTokens.strategy).toBe(1)
    })

    test('technology secondary: research 1 technology (costs 4 resources)', () => {
      const game = t.fixture()
      t.setBoard(game, {
        micah: {
          tradeGoods: 1,  // Hacan has 3R planets + 1TG = 4R for tech secondary
        },
      })
      game.run()
      pickStrategyCards(game, 'technology', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')  // micah: allocate 3 tokens
      // Dennis: leadership secondary auto-passes (2I, not enough for tokens)

      // Dennis uses technology (primary: research 1 tech)
      t.choose(game, 'Strategic Action.technology')
      t.choose(game, 'sarween-tools')
      // Micah uses technology secondary (costs 1 strategy token + 4 resources)
      t.choose(game, 'Use Secondary')
      // Micah picks a tech
      const micahChoices = t.currentChoices(game)
      t.choose(game, micahChoices[0])

      const micah = game.players.byName('micah')
      expect(micah.getTechIds().length).toBeGreaterThan(2)
      // Spent 1 strategy token
      expect(micah.commandTokens.strategy).toBe(1)
    })

    test('politics secondary: draw 2 action cards', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'politics', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')  // micah: allocate 3 tokens
      // Dennis: leadership secondary auto-passes (2I, not enough for tokens)

      // Dennis uses politics (primary: choose speaker + draw 2 cards + agenda peek)
      t.choose(game, 'Strategic Action.politics')
      // Speaker choice auto-resolves to micah (dennis is current speaker)
      // Agenda deck peek
      t.choose(game, t.currentChoices(game)[0])
      t.choose(game, 'Top of deck')
      t.choose(game, 'Top of deck')
      // Micah uses politics secondary (draw 2 action cards)
      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      // Micah should have drawn 2 action cards
      expect(micah.actionCards.length).toBe(2)
      // Spent 1 strategy token
      expect(micah.commandTokens.strategy).toBe(1)
    })

    test('construction secondary: place 1 structure', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'construction', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')  // micah: allocate 3 tokens
      // Dennis: leadership secondary auto-passes (2I, not enough for tokens)

      // Dennis uses construction (primary)
      t.choose(game, 'Strategic Action.construction')
      t.choose(game, 'Place Structure')
      t.choose(game, 'Federation of Sol:Jord.pds')   // step 1
      t.choose(game, 'Federation of Sol:Jord')   // step 2: planet
      t.choose(game, 'pds')                      // step 2: type
      // Micah uses construction secondary (1 structure)
      t.choose(game, 'Use Secondary')
      // Micah places a PDS on one of their planets
      const micahChoices = t.currentChoices(game)
      t.choose(game, `${micahChoices[0]}.pds`)

      const micah = game.players.byName('micah')
      // Micah should have spent 1 strategy token
      expect(micah.commandTokens.strategy).toBe(1)
    })

    test('warfare secondary: produce in home system', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'warfare', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')  // micah: allocate 3 tokens
      // Dennis: leadership secondary auto-passes (2I, not enough for tokens)

      // Dennis uses warfare (primary: remove token + redistribute)
      t.choose(game, 'Strategic Action.warfare')
      t.choose(game, 'Done')  // no tokens to remove — just redistribute
      // Micah uses warfare secondary (produce in home system)
      t.choose(game, 'Use Secondary')

      // Micah should be prompted for production in home system
      const choices = t.currentChoices(game)
      // Should have production choices or Done
      expect(choices).toContain('Done')
      t.choose(game, 'Done')  // skip production

      const micah = game.players.byName('micah')
      expect(micah.commandTokens.strategy).toBe(1)
    })

    test('imperial secondary: draw 1 secret objective', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // Micah has leadership(1), goes first
      t.choose(game, 'Strategic Action.leadership')  // micah: leadership
      t.choose(game, 'Done')  // micah: allocate 3 tokens
      // Dennis: leadership secondary auto-passes (2I, not enough for tokens)

      // Dennis uses imperial (primary)
      t.choose(game, 'Strategic Action.imperial')
      // Micah uses imperial secondary → draws secret objective
      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.secretObjectives.length).toBe(1)
      expect(micah.commandTokens.strategy).toBe(1)
    })
  })

  describe('Card Effects', () => {
    test('leadership tokens persist through status phase', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses leadership (gains 3 tactic tokens)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // dennis: allocate 3 tokens
      // Micah uses diplomacy — must choose a system
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')  // micah picks their home system
      // Dennis has no exhausted planets — diplomacy secondary auto-skipped
      // Both pass
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: redistribute (Dennis gains 3 for Versatile, Micah gains 2)
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Dennis: 3 (start) + 3 (leadership) - 1 (diplomacy token) + 3 (status: 2+1 versatile) = 8
      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.tactics).toBe(8)
    })

    test('trade goods from Trade persist', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'trade', 'imperial')

      // Dennis (trade=5) goes first
      t.choose(game, 'Strategic Action.trade')
      // Dennis chooses micah for free secondary
      t.choose(game, 'micah')
      // Micah accepts free secondary
      t.choose(game, 'Use Secondary')

      const dennis = game.players.byName('dennis')
      expect(dennis.tradeGoods).toBe(3)
      expect(dennis.commodities).toBe(4)  // Sol max commodities

      // Micah replenished via free secondary
      const micah = game.players.byName('micah')
      expect(micah.commodities).toBe(6)  // Hacan max commodities
    })
  })

  describe('Strategy Card Rule Fixes', () => {
    describe('Imperial primary — public objective scoring (Rule 45)', () => {
      test('score public objective when requirements met', () => {
        const game = t.fixture()
        t.setBoard(game, {
          revealedObjectives: ['develop-weaponry'],
          dennis: {
            technologies: ['neural-motivator', 'antimass-deflectors', 'infantry-ii', 'carrier-ii'],
            planets: { 'mecatol-rex': { exhausted: false } },
          },
        })
        game.run()
        pickStrategyCards(game, 'imperial', 'leadership')

        // Micah has leadership(1), goes first
        t.choose(game, 'Strategic Action.leadership')  // micah: leadership
        t.choose(game, 'Done')  // micah: allocate 3 tokens
        t.choose(game, 'Pass')  // dennis declines leadership secondary (has Mecatol Rex, 8I)

        // Dennis uses imperial
        t.choose(game, 'Strategic Action.imperial')
        // Dennis qualifies for develop-weaponry (2 unit upgrades) — offered to score
        t.choose(game, 'develop-weaponry: Develop Weaponry')
        t.choose(game, 'Pass')  // micah declines imperial secondary

        const dennis = game.players.byName('dennis')
        expect(game.state.scoredObjectives['dennis']).toContain('develop-weaponry')
        // 1 VP from objective + 1 VP from Mecatol Rex = 2
        expect(dennis.getVictoryPoints()).toBe(2)
      })

      test('skip public objective scoring if no objectives revealed', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: {
            planets: { 'mecatol-rex': { exhausted: false } },
          },
        })
        game.run()
        pickStrategyCards(game, 'imperial', 'leadership')

        t.choose(game, 'Strategic Action.leadership')  // micah: leadership
        t.choose(game, 'Done')  // micah: allocate 3 tokens
        t.choose(game, 'Pass')  // dennis declines leadership secondary (has Mecatol Rex, 8I)

        // Dennis uses imperial — no revealed objectives, skips to Mecatol check
        t.choose(game, 'Strategic Action.imperial')
        t.choose(game, 'Pass')  // micah declines imperial secondary

        const dennis = game.players.byName('dennis')
        // Only Mecatol VP, no objective scored
        expect(dennis.getVictoryPoints()).toBe(1)
      })

      test('draw secret objective when not controlling Mecatol Rex', () => {
        const game = t.fixture()
        game.run()
        pickStrategyCards(game, 'imperial', 'leadership')

        t.choose(game, 'Strategic Action.leadership')  // micah: leadership
        t.choose(game, 'Done')  // micah: allocate 3 tokens

        // Dennis uses imperial — no Mecatol Rex → draws secret objective
        t.choose(game, 'Strategic Action.imperial')
        t.choose(game, 'Pass')  // micah declines imperial secondary

        const dennis = game.players.byName('dennis')
        expect(dennis.getVictoryPoints()).toBe(0)
        expect(dennis.secretObjectives.length).toBe(1)
      })
    })

    describe('Leadership — influence spending (Rule 52)', () => {
      test('primary: gains 3 command tokens', () => {
        const game = t.fixture()
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Strategic Action.leadership')
        t.choose(game, 'Done')  // dennis: allocate 3 tokens

        const dennis = game.players.byName('dennis')
        // 3 (start) + 3 (leadership) = 6
        expect(dennis.commandTokens.tactics).toBe(6)
      })

      test('primary: can spend influence for additional tokens', () => {
        const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Strategic Action.leadership')
        t.choose(game, 'Done')  // dennis: allocate 3 tokens
        // Xxcha has 4 influence — can buy 1 token (3 influence)
        t.choose(game, '1 token (3 influence)')
        t.choose(game, 'archon-ren (3)')  // exhaust archon-ren (3I >= 3I needed)
        t.choose(game, 'Done')  // dennis: allocate purchased token

        const dennis = game.players.byName('dennis')
        // 3 (start) + 3 (leadership) + 1 (influence) = 7
        expect(dennis.commandTokens.tactics).toBe(7)
        // Only archon-ren exhausted (3I), archon-tau (1I) still ready
        expect(dennis.getTotalInfluence()).toBe(1)
      })

      test('primary: can skip influence spending', () => {
        const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Strategic Action.leadership')
        t.choose(game, 'Done')  // dennis: allocate 3 tokens
        t.choose(game, 'Skip')  // decline influence spending

        const dennis = game.players.byName('dennis')
        // 3 (start) + 3 (leadership) = 6, no extra tokens
        expect(dennis.commandTokens.tactics).toBe(6)
        // No influence spent
        expect(dennis.getTotalInfluence()).toBe(4)
      })

      test('secondary: free (no strategy token cost)', () => {
        const game = t.fixture()
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Strategic Action.leadership')
        t.choose(game, 'Done')  // dennis: allocate 3 tokens
        // Micah: leadership secondary auto-passes (Hacan 2I, not enough for tokens)

        const micah = game.players.byName('micah')
        // Strategy NOT spent (leadership secondary is free)
        expect(micah.commandTokens.strategy).toBe(2)
        // Hacan has 2 influence — not enough for a token (requires 3 per token)
        expect(micah.commandTokens.tactics).toBe(3)
      })

      test('secondary: can spend influence for tokens', () => {
        const game = t.fixture({ factions: ['emirates-of-hacan', 'xxcha-kingdom'] })
        game.run()
        pickStrategyCards(game, 'leadership', 'diplomacy')

        t.choose(game, 'Strategic Action.leadership')
        t.choose(game, 'Done')  // dennis: allocate 3 tokens
        // Dennis (Hacan, 2I) — leadership secondary auto-passes (not enough for tokens)
        // Micah (Xxcha, 4I) — prompted for influence spending
        t.choose(game, '1 token (3 influence)')
        t.choose(game, 'archon-ren (3)')  // micah: exhaust archon-ren (3I >= 3I needed)
        t.choose(game, 'Done')  // micah: allocate purchased token

        const micah = game.players.byName('micah')
        // Strategy NOT spent (leadership secondary is free)
        expect(micah.commandTokens.strategy).toBe(2)
        // 3 (start) + 1 (influence) = 4
        expect(micah.commandTokens.tactics).toBe(4)
        // Only archon-ren exhausted (3I), archon-tau (1I) still ready
        expect(micah.getTotalInfluence()).toBe(1)
      })
    })

    describe('Technology — 2nd research + secondary cost (Rule 91)', () => {
      test('primary: spend 6 resources for additional tech', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: { tradeGoods: 2 },  // 4R (Jord) + 2TG = 6R
        })
        game.run()
        pickStrategyCards(game, 'technology', 'imperial')

        t.choose(game, 'Strategic Action.technology')
        t.choose(game, 'sarween-tools')  // first tech (free)
        // 2nd tech prompt appears (6R available)
        t.choose(game, 'Research Additional Tech (6 resources)')
        t.choose(game, 'gravity-drive')  // second tech (costs 6R)

        const dennis = game.players.byName('dennis')
        expect(dennis.hasTechnology('sarween-tools')).toBe(true)
        expect(dennis.hasTechnology('gravity-drive')).toBe(true)
        // Paid 6 resources: Jord exhausted (4R) + 2TG spent
        expect(game.state.planets['jord'].exhausted).toBe(true)
        expect(dennis.tradeGoods).toBe(0)
      })

      test('primary: skip 2nd tech', () => {
        const game = t.fixture()
        t.setBoard(game, {
          dennis: { tradeGoods: 2 },
        })
        game.run()
        pickStrategyCards(game, 'technology', 'imperial')

        t.choose(game, 'Strategic Action.technology')
        t.choose(game, 'sarween-tools')
        t.choose(game, 'Skip')  // decline 2nd tech

        const dennis = game.players.byName('dennis')
        expect(dennis.hasTechnology('sarween-tools')).toBe(true)
        expect(dennis.tradeGoods).toBe(2)  // not spent
      })

      test('primary: no 2nd tech prompt when insufficient resources', () => {
        const game = t.fixture()
        game.run()
        pickStrategyCards(game, 'technology', 'imperial')

        t.choose(game, 'Strategic Action.technology')
        t.choose(game, 'sarween-tools')
        // Dennis has 4R (Jord), < 6 — no 2nd tech prompt

        // Should be at Micah's turn (tech secondary skipped — Micah has 3R < 4R)
        expect(game.waiting.selectors[0].actor).toBe('micah')
      })

      test('secondary: player with insufficient resources is auto-skipped', () => {
        const game = t.fixture()
        game.run()
        pickStrategyCards(game, 'technology', 'imperial')

        t.choose(game, 'Strategic Action.technology')
        t.choose(game, 'sarween-tools')
        // Micah has 3R (Hacan planets) < 4R — auto-skipped, no prompt

        // Should be at Micah's turn now
        expect(game.waiting.selectors[0].actor).toBe('micah')
        expect(game.waiting.selectors[0].title).toBe('Choose Action')
      })

      test('secondary: exhausts planets to pay 4 resources', () => {
        const game = t.fixture()
        t.setBoard(game, {
          micah: { tradeGoods: 1 },  // 3R + 1TG = 4R
        })
        game.run()
        pickStrategyCards(game, 'technology', 'leadership')

        t.choose(game, 'Strategic Action.leadership')  // micah: leadership
        t.choose(game, 'Done')  // micah: allocate 3 tokens
        // Dennis: leadership secondary auto-passes (2I, not enough for tokens)

        t.choose(game, 'Strategic Action.technology')  // dennis: technology
        t.choose(game, 'sarween-tools')  // dennis researches
        // Micah uses tech secondary (costs strategy token + 4 resources)
        t.choose(game, 'Use Secondary')
        const micahChoices = t.currentChoices(game)
        t.choose(game, micahChoices[0])  // micah researches a tech

        const micah = game.players.byName('micah')
        expect(micah.getTechIds().length).toBeGreaterThan(2)
        expect(micah.commandTokens.strategy).toBe(1)
        // Paid 4R: planets exhausted + TG spent
        expect(micah.tradeGoods).toBe(0)
      })
    })

    describe('Construction secondary — system restriction (Rule 24)', () => {
      test('secondary: places command token in chosen system', () => {
        const game = t.fixture()
        game.run()
        pickStrategyCards(game, 'construction', 'leadership')

        // Micah uses leadership first
        t.choose(game, 'Strategic Action.leadership')  // micah: leadership
        t.choose(game, 'Done')  // micah: allocate 3 tokens
        // Dennis: leadership secondary auto-passes (2I, not enough for tokens)

        // Dennis uses construction (primary)
        t.choose(game, 'Strategic Action.construction')
        t.choose(game, 'Place Structure')
        t.choose(game, 'Federation of Sol:Jord.pds')
        t.choose(game, 'Federation of Sol:Jord')
        t.choose(game, 'pds')
        // Micah uses construction secondary
        t.choose(game, 'Use Secondary')
        // System selection auto-resolves to hacan-home (only system with controlled planets)
        // Structure selection
        const choices = t.currentChoices(game)
        t.choose(game, `${choices[0]}.pds`)

        // Command token should be placed in hacan-home
        expect(game.state.systems['hacan-home'].commandTokens).toContain('micah')
      })

      test('secondary: can only build on planets in chosen system', () => {
        const game = t.fixture()
        t.setBoard(game, {
          micah: {
            planets: {
              'new-albion': { exhausted: false },  // system 27
            },
          },
        })
        game.run()
        pickStrategyCards(game, 'construction', 'leadership')

        t.choose(game, 'Strategic Action.leadership')  // micah: leadership
        t.choose(game, 'Done')  // micah: allocate 3 tokens
        t.choose(game, 'Skip')  // micah: skip influence spending (3I with new-albion)
        // Dennis: leadership secondary auto-passes (2I, not enough for tokens)

        t.choose(game, 'Strategic Action.construction')  // dennis: construction
        t.choose(game, 'Place Structure')
        t.choose(game, 'Federation of Sol:Jord.pds')
        t.choose(game, 'Federation of Sol:Jord')
        t.choose(game, 'pds')
        // Micah uses construction secondary
        t.choose(game, 'Use Secondary')
        // Now Micah must choose a system: hacan-home or 27
        t.choose(game, 'hacan-home')
        // Structure choices should only include planets in hacan-home
        const choices = t.currentChoices(game)
        for (const choice of choices) {
          // Should only have hacan-home planets, not new-albion (system 27)
          expect(['Emirates of Hacan:Arretze', 'Emirates of Hacan:Hercant', 'Emirates of Hacan:Kamdorn']).toContain(choice)
        }
        t.choose(game, `${choices[0]}.pds`)

        // Command token in hacan-home
        expect(game.state.systems['hacan-home'].commandTokens).toContain('micah')
      })
    })
  })
})
