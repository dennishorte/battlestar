const t = require('../../../testutil_v2.js')

test('gets grain and sows after Major Improvement', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    actionSpaces: ['Major Improvement'],
    dennis: {
      occupations: ['young-farmer-d112'],
      grain: 1,
      farmyard: {
        fields: [{ row: 2, col: 0 }],
      },
    },
  })
  game.run()
  t.choose(game, 'Major Improvement')
  // No affordable improvements → auto-skip. onAction fires.
  // +1 grain (now 2), offer sow (1 empty field, grain > 0)
  t.choose(game, 'Sow fields')
  t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
  // Only 1 field → sow auto-ends
  t.choose(game, 'Day Laborer')  // micah
  t.choose(game, 'Fishing')      // dennis — gets 1 food (instant action)
  t.choose(game, 'Clay Pit')     // micah
  t.testBoard(game, {
    dennis: {
      occupations: ['young-farmer-d112'],
      grain: 1, // 1 + 1(YF) - 1(sow) = 1
      food: 1,  // 0 + 1(Fishing)
      farmyard: {
        fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
      },
    },
  })
})

test('gets grain without sowing when no fields', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    actionSpaces: ['Major Improvement'],
    dennis: {
      occupations: ['young-farmer-d112'],
    },
  })
  game.run()
  t.choose(game, 'Major Improvement')
  // No fields → no sow offer, just grain
  t.choose(game, 'Day Laborer')  // micah
  t.choose(game, 'Fishing')      // dennis
  t.choose(game, 'Clay Pit')     // micah
  t.testBoard(game, {
    dennis: {
      occupations: ['young-farmer-d112'],
      grain: 1,
      food: 1,
    },
  })
})
