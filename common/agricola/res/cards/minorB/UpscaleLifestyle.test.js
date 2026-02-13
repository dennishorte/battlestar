const t = require('../../../testutil_v2.js')

describe('UpscaleLifestyle', () => {
  test('gives 5 clay and renovates on play', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['upscale-lifestyle-b001'],
        wood: 3,
        reed: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Upscale Lifestyle')
    // onPlay: gets 5 clay, then renovation auto-fires (wood→clay: 2 clay + 2 reed for 2 rooms)

    t.testBoard(game, {
      dennis: {
        clay: 3,
        reed: 1,
        wood: 0,
        food: 1,
        roomType: 'clay',
        hand: [],
        minorImprovements: ['upscale-lifestyle-b001'],
      },
    })
  })

  test('gives 5 clay but skips renovation when cannot afford', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['upscale-lifestyle-b001'],
        wood: 3,
        reed: 0,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Upscale Lifestyle')
    // onPlay: gets 5 clay, but can't renovate (no reed)

    t.testBoard(game, {
      dennis: {
        clay: 5,
        reed: 0,
        wood: 0,
        food: 1,
        roomType: 'wood',
        hand: [],
        minorImprovements: ['upscale-lifestyle-b001'],
      },
    })
  })
})
