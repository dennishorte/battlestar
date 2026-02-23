const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Yin Brotherhood', () => {
  describe('Devotion', () => {
    test('destroys own ship to produce hit after space combat round', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      t.setBoard(game, {
        dennis: {
          units: {
            'yin-home': {
              space: ['cruiser', 'destroyer'],
              'darien': ['space-dock'],
            },
          },
        },
        micah: {
          units: {
            '27': {
              space: ['fighter', 'fighter'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'cruiser', from: 'yin-home', count: 1 },
          { unitType: 'destroyer', from: 'yin-home', count: 1 },
        ],
      })

      // During combat, Yin gets Devotion prompt after each round
      // Choose to destroy destroyer to produce a hit
      t.choose(game, 'Destroy destroyer')

      // Combat should resolve — Yin should win
      const micahShips = game.state.units['27'].space
        .filter(u => u.owner === 'micah')
      expect(micahShips.length).toBe(0)

      // Yin should have lost the destroyer (sacrificed) but cruiser survives
      const dennisShips = game.state.units['27'].space
        .filter(u => u.owner === 'dennis')
      expect(dennisShips.some(u => u.type === 'cruiser')).toBe(true)
      expect(dennisShips.every(u => u.type !== 'destroyer')).toBe(true)
    })
  })

  describe('Indoctrination', () => {
    test('replaces enemy infantry at ground combat start', () => {
      const game = t.fixture({ factions: ['yin-brotherhood', 'emirates-of-hacan'] })
      // Yin invades a planet controlled by Hacan
      t.setBoard(game, {
        dennis: {
          units: {
            'yin-home': {
              space: ['carrier'],
              'darien': ['infantry', 'infantry', 'infantry', 'infantry', 'space-dock'],
            },
          },
        },
        micah: {
          planets: {
            'new-albion': { exhausted: false },
          },
          units: {
            '27': {
              'new-albion': ['infantry', 'infantry', 'space-dock'],
            },
          },
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Yin) moves carrier + infantry to system 27
      t.choose(game, 'Tactical Action')
      t.action(game, 'activate-system', { systemId: '27' })
      t.action(game, 'move-ships', {
        movements: [
          { unitType: 'carrier', from: 'yin-home', count: 1 },
          { unitType: 'infantry', from: 'yin-home', count: 4 },
        ],
      })

      // Indoctrination prompt: spend 2 influence to replace 1 enemy infantry
      t.choose(game, 'Indoctrinate')

      // Ground combat resolves. Yin should win (4+1 vs 2-1 infantry)
      expect(game.state.planets['new-albion'].controller).toBe('dennis')
    })
  })
})
