const t = require('../../../testutil_v2.js')

test('takes goods from pile during harvest', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 4,
    dennis: {
      hand: ['field-cultivator-d126'],
      food: 5,
      farmyard: {
        fields: [
          { row: 2, col: 0, crop: 'grain', cropCount: 2 },
          { row: 2, col: 1, crop: 'grain', cropCount: 1 },
        ],
      },
    },
  })
  game.run()
  t.choose(game, 'Lessons A')
  t.choose(game, 'Field Cultivator')
  t.choose(game, 'Day Laborer')  // micah
  t.choose(game, 'Grain Seeds')  // dennis
  t.choose(game, 'Clay Pit')     // micah
  // Harvest: 2 fields with crops → onHarvestField fires twice
  // Pile: ['wood', 'clay', 'reed', 'stone', 'reed', 'clay', 'wood']
  t.choose(game, 'Take 1 wood from pile')  // first field
  t.choose(game, 'Take 1 clay from pile')  // second field
  t.testBoard(game, {
    dennis: {
      occupations: ['field-cultivator-d126'],
      wood: 1,
      clay: 1,
      grain: 3, // 0 + 1(Grain Seeds) + 2(harvest: 1 from each field)
      food: 1,  // 5 - 4(feeding)
      farmyard: {
        fields: [
          { row: 2, col: 0, crop: 'grain', cropCount: 1 },
          { row: 2, col: 1 },
        ],
      },
    },
  })
})

test('can skip taking from pile', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 4,
    dennis: {
      hand: ['field-cultivator-d126'],
      food: 4,
      farmyard: {
        fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 2 }],
      },
    },
  })
  game.run()
  t.choose(game, 'Lessons A')
  t.choose(game, 'Field Cultivator')
  t.choose(game, 'Day Laborer')
  t.choose(game, 'Grain Seeds')
  t.choose(game, 'Clay Pit')
  // Harvest: 1 field with crops → onHarvestField once
  t.choose(game, 'Skip')
  t.testBoard(game, {
    dennis: {
      occupations: ['field-cultivator-d126'],
      grain: 2, // 1(Grain Seeds) + 1(harvest)
      food: 0,  // 4 - 4(feeding)
      farmyard: {
        fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
      },
    },
  })
})
