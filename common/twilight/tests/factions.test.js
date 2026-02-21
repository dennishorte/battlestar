const t = require('../testutil.js')
const res = require('../res/index.js')

describe('Factions', () => {
  describe('Federation of Sol', () => {
    test('starts with Antimass Deflectors and Neural Motivator', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
    })

    test('starts with 2 carriers, 1 destroyer, 5 infantry, 1 space dock', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'sol-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter'])

      const jord = game.state.units[homeSystem].planets['jord']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(jord).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('Versatile: gains 1 extra command token in status phase', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      // Strategy phase
      t.choose(game, 'leadership')
      t.choose(game, 'diplomacy')

      // Both use strategy cards then pass
      t.choose(game, 'Strategic Action')  // dennis: leadership (auto)
      t.choose(game, 'Pass')             // micah declines leadership secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy (needs system choice)
      t.choose(game, 'hacan-home')        // micah picks system for diplomacy
      t.choose(game, 'Pass')             // dennis declines diplomacy secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: dennis (Sol) gets 3 tokens (2 + 1 Versatile), micah gets 2
      // Both click Done to accept default distribution (all to tactics)
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Sol: tactics started at 3, spent 0 (used strategic action, not tactical),
      // then gains 3 in status = tactics should be 6
      // Hacan: tactics 3, gains 2 = 5
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      // Dennis: 3 (start) + 3 (leadership primary) + 3 (status: 2 + 1 Versatile) = 9
      expect(dennis.commandTokens.tactics).toBe(9)
      // Micah: 3 (start) + 2 (status) = 5
      expect(micah.commandTokens.tactics).toBe(5)
    })

    test('flagship Genesis has capacity 12', () => {
      const faction = res.getFaction('federation-of-sol')
      expect(faction.flagship.name).toBe('Genesis')
      expect(faction.flagship.capacity).toBe(12)
    })

    test('Spec Ops II upgrades infantry', () => {
      const faction = res.getFaction('federation-of-sol')
      const specOps = faction.factionTechnologies.find(t => t.id === 'spec-ops-ii')
      expect(specOps).toBeTruthy()
      expect(specOps.unitUpgrade).toBe('infantry')
      expect(specOps.stats.combat).toBe(6)
    })

    test('Advanced Carrier II adds sustain damage to carriers', () => {
      const faction = res.getFaction('federation-of-sol')
      const carrier2 = faction.factionTechnologies.find(t => t.id === 'advanced-carrier-ii')
      expect(carrier2).toBeTruthy()
      expect(carrier2.unitUpgrade).toBe('carrier')
      expect(carrier2.stats.abilities).toContain('sustain-damage')
      expect(carrier2.stats.capacity).toBe(8)
    })
  })

  describe('Emirates of Hacan', () => {
    test('starts with Antimass Deflectors and Sarween Tools', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const micah = game.players.byName('micah')
      expect(micah.hasTechnology('antimass-deflectors')).toBe(true)
      expect(micah.hasTechnology('sarween-tools')).toBe(true)
    })

    test('starts with 2 carriers, 1 cruiser, 2 fighters, 4 infantry, 1 space dock', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'hacan-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'micah')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'])

      // Infantry split across arretze and hercant
      const arretze = game.state.units[homeSystem].planets['arretze']
        .filter(u => u.owner === 'micah')
        .map(u => u.type)
        .sort()
      expect(arretze).toEqual(['infantry', 'infantry', 'space-dock'])

      const hercant = game.state.units[homeSystem].planets['hercant']
        .filter(u => u.owner === 'micah')
        .map(u => u.type)
        .sort()
      expect(hercant).toEqual(['infantry', 'infantry'])
    })

    test('6 commodities', () => {
      const faction = res.getFaction('emirates-of-hacan')
      expect(faction.commodities).toBe(6)
    })

    test('Masters of Trade: free Trade secondary', () => {
      const faction = res.getFaction('emirates-of-hacan')
      const mastersOfTrade = faction.abilities.find(a => a.id === 'masters-of-trade')
      expect(mastersOfTrade).toBeTruthy()
    })

    test('Guild Ships: trade with non-neighbors', () => {
      const faction = res.getFaction('emirates-of-hacan')
      const guildShips = faction.abilities.find(a => a.id === 'guild-ships')
      expect(guildShips).toBeTruthy()
    })
  })

  describe('Barony of Letnev', () => {
    test('starts with Antimass Deflectors and Plasma Scoring', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      game.run()

      const scott = game.players.byName('scott')
      expect(scott.hasTechnology('antimass-deflectors')).toBe(true)
      expect(scott.hasTechnology('plasma-scoring')).toBe(true)
    })

    test('starts with 1 dreadnought, 1 carrier, 1 destroyer, 1 fighter, 3 infantry, 1 space dock', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'barony-of-letnev'],
      })
      game.run()

      const homeSystem = 'letnev-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'destroyer', 'dreadnought', 'fighter'])

      const arcPrime = game.state.units[homeSystem].planets['arc-prime']
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(arcPrime).toEqual(['infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('2 commodities', () => {
      const faction = res.getFaction('barony-of-letnev')
      expect(faction.commodities).toBe(2)
    })

    test('Munitions Reserves: spend 2 TG to reroll combat dice', () => {
      const faction = res.getFaction('barony-of-letnev')
      const munitions = faction.abilities.find(a => a.id === 'munitions-reserves')
      expect(munitions).toBeTruthy()
    })

    test('Armada: fleet pool +2 for non-fighter ships', () => {
      const faction = res.getFaction('barony-of-letnev')
      const armada = faction.abilities.find(a => a.id === 'armada')
      expect(armada).toBeTruthy()
    })
  })

  describe('Naalu Collective', () => {
    test('starts with Neural Motivator and Sarween Tools', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
      expect(dennis.hasTechnology('sarween-tools')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['naalu-collective', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'naalu-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'destroyer', 'fighter', 'fighter', 'fighter'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('naalu-collective')
      expect(faction.commodities).toBe(3)
    })

    test('Telepathic ability defined', () => {
      const faction = res.getFaction('naalu-collective')
      const telepathic = faction.abilities.find(a => a.id === 'telepathic')
      expect(telepathic).toBeTruthy()
    })
  })

  describe('Mentak Coalition', () => {
    test('starts with Sarween Tools and Plasma Scoring', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      game.run()

      const scott = game.players.byName('scott')
      expect(scott.hasTechnology('sarween-tools')).toBe(true)
      expect(scott.hasTechnology('plasma-scoring')).toBe(true)
    })

    test('starts with correct units including PDS', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'mentak-coalition'],
      })
      game.run()

      const homeSystem = 'mentak-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'cruiser', 'fighter', 'fighter', 'fighter'])

      const mollPrimus = game.state.units[homeSystem].planets['moll-primus']
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(mollPrimus).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'pds', 'space-dock'])
    })

    test('2 commodities', () => {
      const faction = res.getFaction('mentak-coalition')
      expect(faction.commodities).toBe(2)
    })

    test('Ambush ability defined', () => {
      const faction = res.getFaction('mentak-coalition')
      const ambush = faction.abilities.find(a => a.id === 'ambush')
      expect(ambush).toBeTruthy()
    })

    test('Pillage ability defined', () => {
      const faction = res.getFaction('mentak-coalition')
      const pillage = faction.abilities.find(a => a.id === 'pillage')
      expect(pillage).toBeTruthy()
    })
  })

  describe('Yssaril Tribes', () => {
    test('starts with Neural Motivator', () => {
      const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['yssaril-tribes', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'yssaril-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('yssaril-tribes')
      expect(faction.commodities).toBe(3)
    })

    test('Stall Tactics ability defined', () => {
      const faction = res.getFaction('yssaril-tribes')
      const stallTactics = faction.abilities.find(a => a.id === 'stall-tactics')
      expect(stallTactics).toBeTruthy()
    })
  })

  describe('Universities of Jol-Nar', () => {
    test('starts with all 4 base technologies', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
      expect(dennis.hasTechnology('sarween-tools')).toBe(true)
      expect(dennis.hasTechnology('plasma-scoring')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['universities-of-jol-nar', 'emirates-of-hacan'] })
      game.run()

      const homeSystem = 'jolnar-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'dreadnought', 'fighter'])

      const nar = game.state.units[homeSystem].planets['nar']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(nar).toEqual(['infantry', 'pds', 'pds'])

      const jol = game.state.units[homeSystem].planets['jol']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(jol).toEqual(['infantry', 'space-dock'])
    })

    test('4 commodities', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      expect(faction.commodities).toBe(4)
    })

    test('Fragile ability defined', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      const fragile = faction.abilities.find(a => a.id === 'fragile')
      expect(fragile).toBeTruthy()
    })

    test('Analytical ability defined', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      const analytical = faction.abilities.find(a => a.id === 'analytical')
      expect(analytical).toBeTruthy()
    })

    test('Brilliant ability defined', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      const brilliant = faction.abilities.find(a => a.id === 'brilliant')
      expect(brilliant).toBeTruthy()
    })

    test('faction technologies defined', () => {
      const faction = res.getFaction('universities-of-jol-nar')
      expect(faction.factionTechnologies.length).toBe(2)
      const eRes = faction.factionTechnologies.find(t => t.id === 'e-res-siphons')
      const spatial = faction.factionTechnologies.find(t => t.id === 'spatial-conduit-cylinder')
      expect(eRes).toBeTruthy()
      expect(spatial).toBeTruthy()
    })
  })

  describe("Sardakk N'orr", () => {
    test('starts with no technologies', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'sardakk-norr'],
      })
      game.run()

      const scott = game.players.byName('scott')
      expect(scott.getTechnologies().length).toBe(0)
    })

    test('starts with correct units', () => {
      const game = t.fixture({
        numPlayers: 3,
        factions: ['federation-of-sol', 'emirates-of-hacan', 'sardakk-norr'],
      })
      game.run()

      const homeSystem = 'norr-home'
      const spaceUnits = game.state.units[homeSystem].space
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser'])

      const trenlak = game.state.units[homeSystem].planets['trenlak']
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(trenlak).toEqual(['infantry', 'infantry', 'infantry', 'pds'])

      const quinarra = game.state.units[homeSystem].planets['quinarra']
        .filter(u => u.owner === 'scott')
        .map(u => u.type)
        .sort()

      expect(quinarra).toEqual(['infantry', 'infantry', 'space-dock'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('sardakk-norr')
      expect(faction.commodities).toBe(3)
    })

    test('Unrelenting ability defined', () => {
      const faction = res.getFaction('sardakk-norr')
      const unrelenting = faction.abilities.find(a => a.id === 'unrelenting')
      expect(unrelenting).toBeTruthy()
    })

    test('faction technologies defined', () => {
      const faction = res.getFaction('sardakk-norr')
      expect(faction.factionTechnologies.length).toBe(2)
      const valkyrie = faction.factionTechnologies.find(t => t.id === 'valkyrie-particle-weave')
      const exotrireme = faction.factionTechnologies.find(t => t.id === 'exotrireme-ii')
      expect(valkyrie).toBeTruthy()
      expect(exotrireme).toBeTruthy()
      expect(exotrireme.unitUpgrade).toBe('dreadnought')
    })
  })

  describe('Arborec', () => {
    test('starts with Magen Defense Grid', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('magen-defense-grid')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['arborec-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'fighter', 'fighter'])

      const nestphar = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(nestphar).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'pds', 'space-dock'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('arborec')
      expect(faction.commodities).toBe(3)
    })

    test('Mitosis ability defined', () => {
      const faction = res.getFaction('arborec')
      expect(faction.abilities.find(a => a.id === 'mitosis')).toBeTruthy()
    })
  })

  describe('Clan of Saar', () => {
    test('starts with Antimass Deflectors', () => {
      const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['clan-of-saar', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['saar-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'carrier', 'cruiser', 'fighter', 'fighter'])

      const lisis = game.state.units['saar-home'].planets['lisis-ii']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(lisis).toEqual(['infantry', 'infantry', 'space-dock'])

      const ragh = game.state.units['saar-home'].planets['ragh']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(ragh).toEqual(['infantry', 'infantry'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('clan-of-saar')
      expect(faction.commodities).toBe(3)
    })

    test('Scavenge and Nomadic abilities defined', () => {
      const faction = res.getFaction('clan-of-saar')
      expect(faction.abilities.find(a => a.id === 'scavenge')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'nomadic')).toBeTruthy()
    })
  })

  describe('Embers of Muaat', () => {
    test('starts with Plasma Scoring', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('plasma-scoring')).toBe(true)
    })

    test('starts with war sun', () => {
      const game = t.fixture({ factions: ['embers-of-muaat', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['muaat-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['fighter', 'fighter', 'war-sun'])

      const muaat = game.state.units['muaat-home'].planets['muaat']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(muaat).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('4 commodities', () => {
      const faction = res.getFaction('embers-of-muaat')
      expect(faction.commodities).toBe(4)
    })

    test('Star Forge and Gashlai Physiology abilities defined', () => {
      const faction = res.getFaction('embers-of-muaat')
      expect(faction.abilities.find(a => a.id === 'star-forge')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'gashlai-physiology')).toBeTruthy()
    })
  })

  describe('Yin Brotherhood', () => {
    test('starts with Sarween Tools', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('sarween-tools')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['yin-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'carrier', 'destroyer', 'fighter', 'fighter', 'fighter', 'fighter'])

      const darien = game.state.units['yin-home'].planets['darien']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(darien).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'])
    })

    test('2 commodities', () => {
      const faction = res.getFaction('yin-brotherhood')
      expect(faction.commodities).toBe(2)
    })

    test('Indoctrination and Devotion abilities defined', () => {
      const faction = res.getFaction('yin-brotherhood')
      expect(faction.abilities.find(a => a.id === 'indoctrination')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'devotion')).toBeTruthy()
    })
  })

  describe('L1Z1X Mindnet', () => {
    test('starts with Neural Motivator and Plasma Scoring', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('neural-motivator')).toBe(true)
      expect(dennis.hasTechnology('plasma-scoring')).toBe(true)
    })

    test('starts with dreadnought and PDS', () => {
      const game = t.fixture({ factions: ['l1z1x-mindnet', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['l1z1x-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'dreadnought', 'fighter', 'fighter', 'fighter'])

      const planet = game.state.units['l1z1x-home'].planets['0-0-0']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(planet).toEqual(['infantry', 'infantry', 'infantry', 'infantry', 'infantry', 'pds', 'space-dock'])
    })

    test('2 commodities', () => {
      const faction = res.getFaction('l1z1x-mindnet')
      expect(faction.commodities).toBe(2)
    })

    test('Assimilate and Harrow abilities defined', () => {
      const faction = res.getFaction('l1z1x-mindnet')
      expect(faction.abilities.find(a => a.id === 'assimilate')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'harrow')).toBeTruthy()
    })
  })

  describe('Winnu', () => {
    test('starts with no technologies', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.getTechnologies().length).toBe(0)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['winnu-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'fighter', 'fighter'])

      const winnu = game.state.units['winnu-home'].planets['winnu']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(winnu).toEqual(['infantry', 'infantry', 'pds', 'space-dock'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('winnu')
      expect(faction.commodities).toBe(3)
    })

    test('Blood Ties and Reclamation abilities defined', () => {
      const faction = res.getFaction('winnu')
      expect(faction.abilities.find(a => a.id === 'blood-ties')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'reclamation')).toBeTruthy()
    })
  })

  describe('Xxcha Kingdom', () => {
    test('starts with Graviton Laser System', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('graviton-laser-system')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      game.run()

      const spaceUnits = game.state.units['xxcha-home'].space
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'cruiser', 'fighter', 'fighter', 'fighter'])

      const archonRen = game.state.units['xxcha-home'].planets['archon-ren']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(archonRen).toEqual(['infantry', 'infantry', 'pds', 'space-dock'])

      const archonTau = game.state.units['xxcha-home'].planets['archon-tau']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(archonTau).toEqual(['infantry', 'infantry'])
    })

    test('4 commodities', () => {
      const faction = res.getFaction('xxcha-kingdom')
      expect(faction.commodities).toBe(4)
    })

    test('Peace Accords and Quash abilities defined', () => {
      const faction = res.getFaction('xxcha-kingdom')
      expect(faction.abilities.find(a => a.id === 'peace-accords')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'quash')).toBeTruthy()
    })
  })

  describe('Ghosts of Creuss', () => {
    test('starts with Gravity Drive', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('gravity-drive')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['ghosts-of-creuss', 'emirates-of-hacan'] })
      game.run()
      const spaceUnits = game.state.units['creuss-home'].space
        .filter(u => u.owner === 'dennis').map(u => u.type).sort()
      expect(spaceUnits).toEqual(['carrier', 'destroyer', 'destroyer', 'fighter', 'fighter'])
    })

    test('4 commodities', () => {
      const faction = res.getFaction('ghosts-of-creuss')
      expect(faction.commodities).toBe(4)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('ghosts-of-creuss')
      expect(faction.abilities.find(a => a.id === 'quantum-entanglement')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'slipstream')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'creuss-gate')).toBeTruthy()
    })
  })

  describe('Nekro Virus', () => {
    test('starts with Dacxive Animators', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('dacxive-animators')).toBe(true)
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
      game.run()
      const spaceUnits = game.state.units['nekro-home'].space
        .filter(u => u.owner === 'dennis').map(u => u.type).sort()
      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'dreadnought', 'fighter', 'fighter'])
    })

    test('3 commodities', () => {
      const faction = res.getFaction('nekro-virus')
      expect(faction.commodities).toBe(3)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('nekro-virus')
      expect(faction.abilities.find(a => a.id === 'galactic-threat')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'technological-singularity')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'propagation')).toBeTruthy()
    })
  })

  describe('Argent Flight', () => {
    test('3 commodities', () => {
      const faction = res.getFaction('argent-flight')
      expect(faction.commodities).toBe(3)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('argent-flight')
      expect(faction.abilities.find(a => a.id === 'zeal')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'raid-formation')).toBeTruthy()
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
      game.run()
      const spaceUnits = game.state.units['argent-home'].space
        .filter(u => u.owner === 'dennis').map(u => u.type).sort()
      expect(spaceUnits).toEqual(['carrier', 'destroyer', 'destroyer', 'fighter', 'fighter'])
    })
  })

  describe('Empyrean', () => {
    test('starts with Dark Energy Tap', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('dark-energy-tap')).toBe(true)
    })

    test('4 commodities', () => {
      const faction = res.getFaction('empyrean')
      expect(faction.commodities).toBe(4)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('empyrean')
      expect(faction.abilities.find(a => a.id === 'voidborn')).toBeTruthy()
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['empyrean', 'emirates-of-hacan'] })
      game.run()
      const spaceUnits = game.state.units['empyrean-home'].space
        .filter(u => u.owner === 'dennis').map(u => u.type).sort()
      expect(spaceUnits).toEqual(['carrier', 'carrier', 'destroyer', 'fighter', 'fighter'])
    })
  })

  describe('Mahact Gene-Sorcerers', () => {
    test('starts with Bio-Stims and Predictive Intelligence', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('bio-stims')).toBe(true)
      expect(dennis.hasTechnology('predictive-intelligence')).toBe(true)
    })

    test('3 commodities', () => {
      const faction = res.getFaction('mahact-gene-sorcerers')
      expect(faction.commodities).toBe(3)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('mahact-gene-sorcerers')
      expect(faction.abilities.find(a => a.id === 'edict')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'imperia')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'hubris')).toBeTruthy()
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['mahact-gene-sorcerers', 'emirates-of-hacan'] })
      game.run()
      const spaceUnits = game.state.units['mahact-home'].space
        .filter(u => u.owner === 'dennis').map(u => u.type).sort()
      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'dreadnought', 'fighter', 'fighter'])
    })
  })

  describe('Naaz-Rokha Alliance', () => {
    test('starts with Psychoarchaeology and AI Development Algorithm', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('psychoarchaeology')).toBe(true)
      expect(dennis.hasTechnology('ai-development-algorithm')).toBe(true)
    })

    test('3 commodities', () => {
      const faction = res.getFaction('naaz-rokha-alliance')
      expect(faction.commodities).toBe(3)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('naaz-rokha-alliance')
      expect(faction.abilities.find(a => a.id === 'distant-suns')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'fabrication')).toBeTruthy()
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
      game.run()
      const spaceUnits = game.state.units['naazrokha-home'].space
        .filter(u => u.owner === 'dennis').map(u => u.type).sort()
      expect(spaceUnits).toEqual(['carrier', 'carrier', 'destroyer', 'fighter', 'fighter'])
    })
  })

  describe('Nomad', () => {
    test('starts with Sling Relay', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('sling-relay')).toBe(true)
    })

    test('4 commodities', () => {
      const faction = res.getFaction('nomad')
      expect(faction.commodities).toBe(4)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('nomad')
      expect(faction.abilities.find(a => a.id === 'future-sight')).toBeTruthy()
    })

    test('starts with correct units including flagship', () => {
      const game = t.fixture({ factions: ['nomad', 'emirates-of-hacan'] })
      game.run()
      const spaceUnits = game.state.units['nomad-home'].space
        .filter(u => u.owner === 'dennis').map(u => u.type).sort()
      expect(spaceUnits).toEqual(['carrier', 'destroyer', 'fighter', 'fighter', 'fighter', 'flagship'])
    })
  })

  describe('Titans of Ul', () => {
    test('starts with Antimass Deflectors and Scanlink Drone Network', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
      expect(dennis.hasTechnology('scanlink-drone-network')).toBe(true)
    })

    test('2 commodities', () => {
      const faction = res.getFaction('titans-of-ul')
      expect(faction.commodities).toBe(2)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('titans-of-ul')
      expect(faction.abilities.find(a => a.id === 'terragenesis')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'awaken')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'coalescence')).toBeTruthy()
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['titans-of-ul', 'emirates-of-hacan'] })
      game.run()
      const spaceUnits = game.state.units['titans-home'].space
        .filter(u => u.owner === 'dennis').map(u => u.type).sort()
      expect(spaceUnits).toEqual(['cruiser', 'cruiser', 'dreadnought', 'fighter', 'fighter'])
    })
  })

  describe("Vuil'raith Cabal", () => {
    test('starts with Self Assembly Routines', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.hasTechnology('self-assembly-routines')).toBe(true)
    })

    test('2 commodities', () => {
      const faction = res.getFaction('vuil-raith-cabal')
      expect(faction.commodities).toBe(2)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('vuil-raith-cabal')
      expect(faction.abilities.find(a => a.id === 'devour')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'amalgamation')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'riftmeld')).toBeTruthy()
    })

    test('starts with correct units', () => {
      const game = t.fixture({ factions: ['vuil-raith-cabal', 'emirates-of-hacan'] })
      game.run()
      const spaceUnits = game.state.units['cabal-home'].space
        .filter(u => u.owner === 'dennis').map(u => u.type).sort()
      expect(spaceUnits).toEqual(['carrier', 'cruiser', 'dreadnought', 'fighter', 'fighter', 'fighter'])
    })
  })

  describe('Council Keleres', () => {
    test('2 commodities', () => {
      const faction = res.getFaction('council-keleres')
      expect(faction.commodities).toBe(2)
    })

    test('abilities defined', () => {
      const faction = res.getFaction('council-keleres')
      expect(faction.abilities.find(a => a.id === 'council-patronage')).toBeTruthy()
      expect(faction.abilities.find(a => a.id === 'the-tribunii')).toBeTruthy()
    })
  })

  describe('Leaders', () => {
    test('agent starts unlocked', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.agent).toBe('ready')
    })

    test('commander starts locked', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.commander).toBe('locked')
    })

    test('hero starts locked', () => {
      const game = t.fixture()
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.hero).toBe('locked')
    })

    test('commander unlocks when condition met', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.commander).toBe('unlocked')
    })

    test('hero purged after use', () => {
      const game = t.fixture()
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'purged' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.leaders.hero).toBe('purged')
    })
  })
})
