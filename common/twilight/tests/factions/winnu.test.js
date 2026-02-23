const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Winnu', () => {
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
})
