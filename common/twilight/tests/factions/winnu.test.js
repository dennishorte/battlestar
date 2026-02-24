const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Winnu', () => {
  describe('Data', () => {
    test('starting technologies', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.getTechIds()).toEqual([])
    })

    test('commodities is 3', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      game.run()
      const dennis = game.players.byName('dennis')
      expect(dennis.maxCommodities).toBe(3)
    })

    test('faction technologies are defined', () => {
      const { getFaction } = require('../../res/factions/index.js')
      const faction = getFaction('winnu')
      expect(faction.factionTechnologies.length).toBe(3)

      const lazax = faction.factionTechnologies.find(ft => ft.id === 'lazax-gate-folding')
      expect(lazax.color).toBe('blue')
      expect(lazax.prerequisites).toEqual(['blue', 'blue'])

      const hegemonic = faction.factionTechnologies.find(ft => ft.id === 'hegemonic-trade-policy')
      expect(hegemonic.color).toBe('yellow')
      expect(hegemonic.prerequisites).toEqual(['yellow', 'yellow'])

      const imperator = faction.factionTechnologies.find(ft => ft.id === 'imperator')
      expect(imperator.prerequisites).toEqual(['blue', 'red'])
    })
  })

  describe('Blood Ties', () => {
    test('removes custodians without spending influence', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      const { Galaxy } = require('../../model/Galaxy.js')
      const setupGame = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      setupGame.run()
      const galaxy = new Galaxy(setupGame)
      const mecatolAdjacent = galaxy.getAdjacent('18')[0]

      t.setBoard(game, {
        dennis: {
          tradeGoods: 0,
          units: {
            'winnu-home': {
              'winnu': ['space-dock'],
            },
            [mecatolAdjacent]: {
              space: ['carrier'],
              ...((() => {
                const tile = require('../../res/index.js').getSystemTile(mecatolAdjacent) || require('../../res/index.js').getSystemTile(Number(mecatolAdjacent))
                const p = tile?.planets[0]
                return p ? { [p]: ['infantry', 'infantry'] } : {}
              })()),
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: mecatolAdjacent, count: 1 },
          { unitType: 'infantry', from: mecatolAdjacent, count: 2 },
        ],
      })

      // Winnu removes custodians for free (Blood Ties)
      expect(game.state.custodiansRemoved).toBe(true)
      expect(game.players.byName('dennis').victoryPoints).toBe(1)
    })
  })

  describe('Reclamation', () => {
    test('places PDS and dock on Mecatol Rex after gaining control', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      const { Galaxy } = require('../../model/Galaxy.js')
      const setupGame = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      setupGame.run()
      const galaxy = new Galaxy(setupGame)
      const mecatolAdjacent = galaxy.getAdjacent('18')[0]

      t.setBoard(game, {
        dennis: {
          units: {
            'winnu-home': {
              'winnu': ['space-dock'],
            },
            [mecatolAdjacent]: {
              space: ['carrier'],
              ...((() => {
                const tile = require('../../res/index.js').getSystemTile(mecatolAdjacent) || require('../../res/index.js').getSystemTile(Number(mecatolAdjacent))
                const p = tile?.planets[0]
                return p ? { [p]: ['infantry', 'infantry'] } : {}
              })()),
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '18' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: mecatolAdjacent, count: 1 },
          { unitType: 'infantry', from: mecatolAdjacent, count: 2 },
        ],
      })

      // Check Mecatol has PDS and space dock from Reclamation
      const mecatolUnits = game.state.units['18'].planets['mecatol-rex']
        .filter(u => u.owner === 'dennis')
        .map(u => u.type)
        .sort()
      expect(mecatolUnits).toContain('pds')
      expect(mecatolUnits).toContain('space-dock')
    })
  })

  describe('Agent — Rickar Rickani', () => {
    test.todo('exhaust to repair or move mechs')
  })

  describe('Commander — Berekar Berekon', () => {
    test('gives -1 combat modifier (bonus) when controlling Mecatol Rex', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(-1)
    })

    test('no combat modifier without Mecatol Rex control', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(true)
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(0)
    })

    test('no combat modifier when commander is locked', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(dennis.isCommanderUnlocked()).toBe(false)
      expect(game.factionAbilities.getCombatModifier(dennis)).toBe(0)
    })

    test('gives +1 status phase token bonus when controlling Mecatol Rex', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
          planets: {
            'mecatol-rex': { exhausted: false },
          },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities.getStatusPhaseTokenBonus(dennis)).toBe(1)
    })

    test('no status phase token bonus without Mecatol Rex control', () => {
      const game = t.fixture({ factions: ['winnu', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          leaders: { agent: 'ready', commander: 'unlocked', hero: 'locked' },
        },
      })
      game.run()

      const dennis = game.players.byName('dennis')
      expect(game.factionAbilities.getStatusPhaseTokenBonus(dennis)).toBe(0)
    })
  })

  describe('Hero — Mathis Mathinus, Kingmaker', () => {
    test.todo('ACTION: score 1 public objective you meet requirements for, then purge')
  })

  describe('Mech — Reclaimer', () => {
    test.todo('DEPLOY: after another player gains control of a planet you control')
  })

  describe('Promissory Note — Acquiescence', () => {
    test.todo('at start of your turn, choose to return planets or gain Alliance')
  })

  describe('Faction Technologies', () => {
    test.todo('Hegemonic Trade Policy: exhaust to swap resource and influence values during production')
    test.todo('Lazax Gate Folding: treat Mecatol system as having wormholes; ACTION to place infantry on Mecatol')
    test.todo('Imperator: +1 combat per Support for the Throne; +1 move when activating legendary planet system')
  })
})
