const t = require('../../../testutil_v2.js')

describe('Oven Site', () => {
  test('gives 2 wood and offers discounted Clay Oven via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['oven-site-a027'],
        majorImprovements: ['fireplace-2'],
        clay: 1, // discounted oven cost
        stone: 1, // discounted oven cost
      },
    })
    game.run()

    // Dennis takes Meeting Place, plays Oven Site
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Oven Site')
    // onPlay fires: gets 2 wood, then offer discounted oven
    t.choose(game, 'Build Clay Oven')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        wood: 2, // 2 from onPlay
        hand: [],
        minorImprovements: ['oven-site-a027'],
        majorImprovements: ['fireplace-2', 'clay-oven'],
      },
    })
  })

  test('building oven via OvenSite triggers onBuy (bread baking)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['oven-site-a027'],
        majorImprovements: ['fireplace-2'],
        clay: 1,
        stone: 1,
        grain: 2,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Oven Site')
    // Build Clay Oven at discount
    t.choose(game, 'Build Clay Oven')
    // onBuy should fire: Clay Oven offers bread baking
    t.choose(game, 'Bake 1 grain')

    t.testBoard(game, {
      dennis: {
        food: 6, // +1 Meeting Place, +5 baked grain
        wood: 2,
        clay: 0,
        stone: 0,
        grain: 1,
        hand: [],
        minorImprovements: ['oven-site-a027'],
        majorImprovements: ['fireplace-2', 'clay-oven'],
      },
    })
  })

  test('can skip the discounted oven', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['oven-site-a027'],
        majorImprovements: ['fireplace-2'],
        clay: 1,
        stone: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Oven Site')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 1,
        wood: 2,
        clay: 1,
        stone: 1,
        hand: [],
        minorImprovements: ['oven-site-a027'],
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
