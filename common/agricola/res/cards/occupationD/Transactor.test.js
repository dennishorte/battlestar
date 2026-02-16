const t = require('../../../testutil_v2.js')

test('collects building resources before final harvest', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 14,
    dennis: {
      occupations: ['transactor-d098'],
      food: 10,
    },
  })
  game.run()
  // Avoid taking accumulation spaces so resources stay on board
  t.choose(game, 'Day Laborer')   // dennis — instant
  t.choose(game, 'Forest')        // micah — takes wood, Forest resets
  t.choose(game, 'Grain Seeds')   // dennis — instant
  t.choose(game, 'Fishing')       // micah — takes food, Fishing resets
  // Remaining accumulation spaces with resources: Clay Pit (1 clay), Reed Bank (1 reed)
  // onBeforeFinalHarvest: Transactor collects 1 clay + 1 reed
  // Then feeding phase: 4 food needed
  t.testBoard(game, {
    dennis: {
      occupations: ['transactor-d098'],
      clay: 1,   // from Transactor (Clay Pit)
      reed: 1,   // from Transactor (Reed Bank)
      stone: 2,  // from Transactor (Western + Eastern Quarry)
      grain: 1,
      food: 8,   // 10 + 2(DL) - 4(feeding)
    },
  })
})
