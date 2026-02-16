const t = require('../../../testutil_v2.js')

test('pays clay for bonus points after final harvest', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  game.testSetBreakpoint('initialization-complete', () => {
    game.cardState('earthenware-potter-d099').playedEarly = true
  })
  t.setBoard(game, {
    round: 14,
    dennis: {
      occupations: ['earthenware-potter-d099'],
      clay: 3,
      food: 10,
    },
  })
  game.run()
  t.choose(game, 'Day Laborer')   // dennis
  t.choose(game, 'Forest')        // micah
  t.choose(game, 'Grain Seeds')   // dennis
  t.choose(game, 'Clay Pit')      // micah
  // Final harvest: field, feeding, breeding, onHarvestEnd, then onAfterFinalHarvest
  // 2 family members, 3 clay → can pay up to 2
  t.choose(game, 'Pay 2 clay for 2 bonus points')
  t.testBoard(game, {
    dennis: {
      occupations: ['earthenware-potter-d099'],
      clay: 1, // 3 - 2
      grain: 1,
      bonusPoints: 2,
      food: 8, // 10 + 2(DL) - 4(feeding)
    },
  })
})

test('does not trigger if played after round 4', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  // playedEarly defaults to undefined/false (not set via breakpoint)
  t.setBoard(game, {
    round: 14,
    dennis: {
      occupations: ['earthenware-potter-d099'],
      clay: 3,
      food: 10,
    },
  })
  game.run()
  t.choose(game, 'Day Laborer')
  t.choose(game, 'Forest')
  t.choose(game, 'Grain Seeds')
  t.choose(game, 'Clay Pit')
  // No EarthenwarePotter prompt
  t.testBoard(game, {
    dennis: {
      occupations: ['earthenware-potter-d099'],
      clay: 3,
      grain: 1,
      bonusPoints: 0,
      food: 8,
    },
  })
})
